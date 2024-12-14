import { Button } from "@/components/ui/button";
import { BrainCogIcon, EyeIcon, GlobeIcon, MonitorSmartphoneIcon, ServerCogIcon, ZapIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    name: "Store your PDF Documents",
    description: "Keep all your important PDF files securely stored and easily accessible anytime, anywhere.",
    icon: GlobeIcon,
  },
  {
    name: "Blazing Fast Response",
    description: "Experience lightning-fast answers to your queries, ensuring you get the information you need instantly.",
    icon: ZapIcon,
  },
  {
    name: "Chat Memorization",
    description: "Our intelligent chatbot remembers previous interactions, providing a seamless and personalized experience.",
    icon: BrainCogIcon,
  },
  {
    name: "Interactive PDF Viewer",
    description: "Engage with your PDFs like never before using our intuitive and interactive viewer",
    icon: EyeIcon,
  },
  {
    name: "Cloud Backup",
    description: "Rest assured knowing your documents are safely backed up on the cloud, protected from loss or damage",
    icon: ServerCogIcon,
  },
  {
    name: "Responsive across Devices",
    description: "Access and chat with your PDFs seamlessly on any device, whether it's your desktop, tablet, or smartphone",
    icon: MonitorSmartphoneIcon,
  },
]

export default function Home() {
  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-blue-100 to-[#6DB1BF]">
      <div className="bg-[#0D1F2D] py-24  sm:py-32 rounded-md drop-shadow-xl">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-[#6DB1BF]">Your Interactive Document Companion</h2>

            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-6xl">Transform your PDFs into Interactive Conversations</p>

            <p className="mt-6 text-lg leading-8 text-gray-300">
              Upload your document, and our chatbot will answer questions, summarize content, and answer all your Qs. Ideal for everyone,{" "}
              <span className="text-[#6DB1BF]">Chat with PDF</span>{" "}turns static documents into{" "}
              <span className="font-bold">dynamic conversations</span>,
              enhancing productivity 10x fold effortlessly.
            </p>
          </div>
          <Button variant="secondary" asChild className="mt-10 px-8 py-6 text-lg md:text-base hover:scale-95 hover:translate-y-2 transition-all w-full md:max-w-xs duration-200 hover:drop-shadow-lg shadow-blue-600 shadow-lg hover:bg-gray-300">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image
              alt="App screenshot"
              src="https://i.imgur.com/VciRSTI.jpeg"
              width={2432}
              height={1442}
              className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10 shadow-blue-200"
            />
            <div aria-hidden="true" className="relative">
              <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-[#0D1F2D] to-transparent pt-[5%]" />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-white  sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:grap-x-8 lg:gap-y-16">
            {features.map(feature => (
              <div key={feature.name} className="relative pl-9 hover:cursor-pointer transition-all duration-300 hover:scale-105 hover:pl-10 rounded-lg">
                <dt className="inline font-semibold text-gray-300">
                  <feature.icon 
                    aria-hidden="true"
                    className="absolute left-1 top-1 h-5 w-5 text-[#6DB1BF]"
                  />
                </dt>

                <dd>{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
