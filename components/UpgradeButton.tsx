'use client'
import useSubscription from "@/hooks/useSubscription"
import { Button } from "./ui/button"
import Link from "next/link"
import { Loader2Icon, Router, StarIcon } from "lucide-react"
import { createStripePortal } from "@/actions/createStripePortal"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

function UpgradeButton() {
    const { hasActiveMembership, loading } = useSubscription();
    const [ isPending, startTransition ] = useTransition()
    const router = useRouter();

    const handleAccount = () => {
        startTransition(async() => {
            const stripePortalUrl = await createStripePortal();
            router.push(stripePortalUrl);
        })
    }

    if (!hasActiveMembership && !loading) 
        return (
            <Button asChild className="bg-bg text-acc shadow-sm shadow-blue-600 hover:bg-bg/30">
                <Link href="/dashboard/upgrade">
                    Upgrade <StarIcon className="ml-3 fill-acc text-gray-300" />
                </Link>
            </Button>
        );
        if (loading) 
        return(
            <Button className="border-acc">
                <Loader2Icon className="animate-spin"/>
            </Button>
        )

        return (
            <Button
                onClick={handleAccount}
                disabled={isPending}
                className="border-acc bg-acc hover:bg-acc/80"
            >
                {isPending ? (
                    <Loader2Icon className="animate-spin"/>
                ): (
                    <p>
                        <span className="font-extrabold">PRO </span>
                        Account
                    </p>
                )}
            </Button>
        )
}
export default UpgradeButton