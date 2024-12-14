'use client'

import { FrownIcon, PlusCircleIcon } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import useSubscription from "@/hooks/useSubscription"

function PlacehoderDocument() {
  const { isOverFileLimit } = useSubscription();
    const router = useRouter()
    const handleClick = () => {
      if (isOverFileLimit) {
        router.push('/dashboard/upgrade')
      }  else {
        router.push('/dashboard/upload')
      }
    }

  return (
    <Button onClick={handleClick} className="flex flex-col items-center justify-center w-64 h-80 rounded-xl bg-black/30 hover:bg-black/50 drop-shadow-md transition-all duration-300 text-gray-400 hover:shadow-md hover:shadow-blue-600 hover:-translate-y-1 hover:scale-105">
        
        {isOverFileLimit ? (          
          <FrownIcon className="h-16 w-16 mb-2"/>
        ): (
          <PlusCircleIcon className="h-16 w-16 mb-2" />
        )}
        <p>{isOverFileLimit ? "Upgrade to add more documents" : "Add a document"}</p>
    </Button>
  )
}
export default PlacehoderDocument