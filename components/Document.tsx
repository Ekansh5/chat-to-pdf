'use client'

import { useRouter } from "next/navigation";
import byteSize from 'byte-size'
import useSubscription from "@/hooks/useSubscription";
import { useTransition } from "react";
import { DownloadCloud, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { deleteDocument } from "@/actions/deleteDocument";

function Document({
    id,
    name,
    size,
    downloadUrl
}: {
    id: string;
    name: string;
    size: number;
    downloadUrl: string;
}) {

const router = useRouter();
const { hasActiveMembership } = useSubscription();
const [isDeleting, startTransition] = useTransition();

  return (
    <div className="flex flex-col w-64 h-80 rounded-xl bg-black/30 text-white drop-shadow-md justify-between p-4 transition-all transform hover:scale-105 hover:bg-black/50 hover:text-white cursor-pointer group">
        <div className="flex-1"
        onClick={() => {
            router.push(`/dashboard/files/${id}`)
        }}>
            <p className="font-semibold line-clamp-2">{name}</p>
            <p className="text-sm text-gray-500 group-hover:text-indigo-100">
                {byteSize(size).value} KB
            </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 justify-end">
            <Button
                className="bg-black/60 hover:bg-black/50"
                disabled={isDeleting || !hasActiveMembership}
                onClick={() => {
                    const prompt = window.confirm(
                        "Are you sure you want to delete this document?"
                    );
                    if (prompt) {
                        startTransition(async () => {
                            await deleteDocument(id);
                        })
                    }
                }}
            >
                <Trash2Icon className="h-6 w-6 text-red-500"/>
                {!hasActiveMembership && (
                    <span className="text-red-500 ml-2">PRO Feature</span>
                )}
            </Button>


            <Button asChild className="bg-black/60 hover:bg-black/40">
                <a href={downloadUrl} download>
                    <DownloadCloud className="h-6 w-6 text-acc" />
                </a>
            </Button>
        </div>
    </div>
  )
}
export default Document