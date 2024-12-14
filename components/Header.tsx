'use client'
import { SignedIn, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "./ui/button"
import { FilePlus2, MenuIcon } from "lucide-react"
import { useState } from "react"
import UpgradeButton from "./UpgradeButton"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  

function Header() {
    const [hover, setHover] = useState<Boolean>(false)
  return (
    <div className="bg-bg/95 flex justify-between shadow-sm p-5 border-b border-bg text-white">
        <Link href="/" className="text-2xl">Chat to <span className="text-acc">PDF</span></Link>

        <SignedIn>
            <div className="items-center space-x-2 transition-all duration-200 text-acc hidden md:flex">
                <Button asChild variant="link" className="hidden md:flex text-acc">
                    <Link href="/dashboard/upgrade">Pricing</Link>
                </Button>

                <Button asChild className="bg-bg text-acc shadow-sm shadow-blue-600 hover:bg-bg/30">
                    <Link href="/dashboard">My Documents</Link>
                </Button>

                <Button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} asChild className={`${hover === true && "animate-pulse duration-1000 transition-all"} bg-bg text-acc hover:bg-bg/30 border-none shadow-sm shadow-blue-600`}>
                    <Link href="/dashboard/upload">
                    <p className={`${hover === true ? "inline-block" : "hidden"} mr-2 text-acc`}>Upload</p>
                    <FilePlus2 className="text-acc  " />
                </Link>
                </Button>
                <UpgradeButton />
                <UserButton />
            </div>
            <div className="flex items-center space-x-3 md:hidden">
            <div className="flex md:hidden">
            <Sheet>
                <SheetTrigger><MenuIcon className="h-7 w-7 text-acc" /></SheetTrigger>
                <SheetContent className="bg-black/90 border-blue-600 shadow-lg shadow-blue-600">
                    <SheetHeader>
                        <SheetTitle className="text-acc mb-5">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col items-center space-y-5">
                    <Button asChild variant="link" className="bg-gray-300 w-full hover:bg-gray-300/95 text-bg ">
                    <Link href="/dashboard/upgrade">Pricing</Link>
                    </Button>

                <Button asChild className="bg-gray-300 w-full hover:bg-gray-300/95 text-bg shadow-md shadow-blue-600 ">
                    <Link href="/dashboard">My Documents</Link>
                </Button>

                <Button asChild className={`bg-gray-300 w-full hover:bg-gray-300/95 border-none shadow-md shadow-blue-600`}>
                    <Link href="/dashboard/upload">
                    <p className={`mr-2 text-bg`}>Upload</p>
                    <FilePlus2 className="text-bg " />
                </Link>
                </Button>
                </div>
                </SheetContent>
            </Sheet>
            </div>
            <UpgradeButton />
            <UserButton />
            </div>
        </SignedIn>
    </div>
  )
}
export default Header