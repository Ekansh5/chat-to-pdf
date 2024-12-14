import { auth } from "@clerk/nextjs/server"
import PlacehoderDocument from "./PlacehoderDocument"
import { adminDb } from "@/firebaseAdmin";
import Document from "./Document";

async function  Documents() {
  auth().protect();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found")
  }

  const documentsSnapshot = await adminDb.collection("users").doc(userId).collection("files").get();

  return (
    <div className="flex md:flex-wrap p-5 bg-black/20 justify-start lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto overflow-x-scroll">

        {documentsSnapshot.docs.map((doc) => {
          const { name, downloadUrl, size} = doc.data();

          return (
            <Document 
              key={doc.id}
              id={doc.id}
              name={name}
              size={size}
              downloadUrl={downloadUrl}
            />
          )
        })}

        <PlacehoderDocument />
    </div>
  )
}
export default Documents