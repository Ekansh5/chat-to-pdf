import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "../firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_KEY_KEY,
    modelName: "gpt-4o-mini",
})

export const indexName = "saas"

async function fetchMessagesFromDB(docId: string) {
    const { userId } = await auth();
    if(!userId) {
        throw new Error("user not found");
    }
    console.log("--- Fetching chat history from the firestore datatbase... ---")
    const LIMIT = 6
    const chats = await adminDb.collection("users").doc(userId).collection("files").doc(docId).collection("chat").orderBy("createdAt", "asc").limit(LIMIT).get()

    const chatHistory = chats.docs.map((doc) => 
        doc.data().role === 'human'
        ? new HumanMessage(doc.data().message)
        : new AIMessage(doc.data().message)
    );

    console.log(`--- Fetched last ${chatHistory.length} messages succesfully`)
    console.log(chatHistory.map((msg) => msg.content.toString()))

    return chatHistory;
}

export async function generateDocs(docId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not found")
    }

    console.log("--- Dowloading Files from Firebase... ---")
    const firebaseRef = await adminDb.collection("users").doc(userId).collection("files").doc(docId).get()
    const dowloadUrl = firebaseRef.data()?.downloadUrl;

    if (!dowloadUrl) {
        throw new Error ("Dowload Url not found")
    }
    console.log(`--- Dowload Url fetched successully: ${dowloadUrl} ---`)

    const response = await fetch(dowloadUrl);
    const data = await response.blob();

    console.log("--- Loading PDf Document ---")
    const loader = new PDFLoader(data)
    const docs = await loader.load()

    console.log("--- Spiltting the doc into smaller parts... ---")
    const spiltter = new RecursiveCharacterTextSplitter()

    const splitDocs = await spiltter.splitDocuments(docs);
    console.log(`--- Split into ${splitDocs.length} parts ---`)

    return splitDocs;
}

async function namespaceExists(index: Index<RecordMetadata>, namespace: string) {
    if (namespace === null) throw new Error("No namespace value provided.")
        const { namespaces } = await index.describeIndexStats()
    return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not found")
    }

    let pineconeVectorStore
    console.log("--- Generating embeddings... ---")
    const embeddings = new OpenAIEmbeddings()

    const index = pineconeClient.index(indexName)
    const namespaceAlreadyExists = await namespaceExists(index, docId);

    if (namespaceAlreadyExists) {
        console.log(`--- Namespace ${docId} already exists, resuing existing embeddings... ---`)

        pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: index,
            namespace: docId,
        });

        return pineconeVectorStore
    } else {
        const splitDocs = await generateDocs(docId)

        console.log(`--- Storing the embeddings in namespace: ${docId} in the ${indexName} Pinecone vector store. ---`);
        pineconeVectorStore = await PineconeStore.fromDocuments(
            splitDocs,
            embeddings,
            {
                pineconeIndex: index,
                namespace: docId,
            }
        );
        return pineconeVectorStore
    }
}

const generateLangchainCompletion = async (docId: string, question: string) => {
    let pineconeVectorStore;

    pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId)
    if(!pineconeVectorStore) {
        throw new Error("Pinecone vector store not found")
    }

    console.log("--- Creating a retiever... ---");
    const retriever = pineconeVectorStore.asRetriever();

    const chatHistory = await fetchMessagesFromDB(docId)
    const historyAwarePrompt = ChatPromptTemplate.fromMessages([
        ["user", "{input}"],
        [
            "user",
            "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
        ],
    ]);

    console.log("--- Creating a history-aware retriever chain... ---")
    const historyAwareRetrieverChain = await createHistoryAwareRetriever({
        llm: model,
        retriever,
        rephrasePrompt: historyAwarePrompt,
    });

    console.log("--- Defining a prompt template for answering questions... ---")
    const historyAwareRetrievalChain = ChatPromptTemplate.fromMessages([
        [
            "system",
            "Answer the user's question based on the below context: \n\n{context}",
        ],

        ...chatHistory,
        [
            "user",
            "{input}",
        ],
    ]);

    console.log("--- Creating a document combining chains... ---")
    const historyAwareCombineDocsChain = await createStuffDocumentsChain({
        llm: model,
        prompt: historyAwareRetrievalChain,
    });

    console.log("--- Creating the main retrieval chain... ---")
    const conversationalRetrievalChain = await createRetrievalChain({
        retriever: historyAwareRetrieverChain,
        combineDocsChain: historyAwareCombineDocsChain,
    });

    console.log("--- Running the chain with a sample conversation... ---")
    const reply = await conversationalRetrievalChain.invoke({
        chat_history: chatHistory,
        input: question,
    });

    console.log(reply.answer)
    return reply.answer;
};

export { model, generateLangchainCompletion };