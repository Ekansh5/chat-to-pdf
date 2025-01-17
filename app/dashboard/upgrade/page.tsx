'use client'

import { createCheckoutSession } from "@/actions/createCheckoutSession"
import { createStripePortal } from "@/actions/createStripePortal"
import { Button } from "@/components/ui/button"
import useSubscription from "@/hooks/useSubscription"
import getStripe from "@/lib/stripe-js"
import { useUser } from "@clerk/nextjs"
import { CheckIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

export type userDetails = {
    email: string;
    name: string;
}

function PricingPage() {
    const { user } = useUser();
    const router = useRouter();
    const { hasActiveMembership, loading} = useSubscription();
    const [isPending, startTransition] = useTransition();

    const handleUpgrade = () => {
        if (!user) return;

        const userDetails: userDetails = {
            email: user.primaryEmailAddress?.toString()!,
            name: user.fullName!,
        };

        startTransition(async () => {
            const stripe = await getStripe()

            if (hasActiveMembership) {
                // create stripe portal
                const stripePortalUrl = await createStripePortal();
                return router.push(stripePortalUrl)
            }

            const sessionId = await createCheckoutSession(userDetails);

            await stripe?.redirectToCheckout({
                sessionId,
            })
        });
    };

  return (
    <div className="bg-bg min-h-screen">
        <div className="py-24 sm:py-32">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-base font-semibold leading-7 text-acc">Pricing</h2>
                <p className="mt-2 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">Supercharge Your Document Companion</p>
            </div>
            <p className="mx-auto mt-6 max-w-2xl px-10 text-center text-lg leading-8 text-gray-300">
                Choose an affordable plan that&apos;s packed with the best features for interacting with your PDFs, enhancing productivity, and streamlining your workflow.
            </p>

            <div className="max-w-md mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 md:max-w-2xl gap-8 lg:max-w-4xl">
                {/* Free */}
                <div className="ring-1 ring-acc/50 p-8 h-fit pb-12 rounded-3xl bg-black/30">
                    <h3 className="text-lg font-semibold leading-8 text-gray-100">Starter Plan</h3>
                    <p className="mt-4 text-sm leading-6 text-gray-300">Explore Core Features at No Cost</p>
                    <p className="mt-6 flex items-baseline gap-x-1"><span className="text-4xl font-bold tracking-tight text-gray-100">Free</span></p>

                    <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                        <li className="flex gap-x-3">
                            <CheckIcon className="h-6 w-5 flex-none text-acc" />
                            2 Documents
                        </li>
                        <li className="flex gap-x-3">
                            <CheckIcon className="h-6 w-5 flex-none text-acc" />
                            Up to 3 messages per document
                        </li>
                        <li className="flex gap-x-3">
                            <CheckIcon className="h-6 w-5 flex-none text-acc" />
                            Try out the AI Chat Functionality
                        </li>
                    </ul>
                </div>

                {/* Pro */}
                <div className="ring-2 ring-acc rounded-3xl p-8 bg-black/40">
                    <h3 className="text-lg font-semibold leading-8 text-acc">Pro Plan</h3>
                    <p className="mt-4 text-sm leading-6 text-gray-300">Maximize Productivity with PRO Features</p>

                    <p className="mt-6 flex items-baseline gap-x-1">
                        <span className="text-4xl font-bold tracking-tight text-gray-100">
                            $5.99
                        </span>
                        <span className="text-sm font-semibold leading-6 text-gray-300">
                            / month
                        </span>
                    </p>
                    
                    <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                        <li className="flex gap-x-3">
                            <CheckIcon className="h-6 w-5 flex-none text-acc" />
                            Store upto 20 Documents
                        </li>
                        <li className="flex gap-x-3">
                            <CheckIcon className="h-6 w-5 flex-none text-acc" />
                            Ability to Delete Documents
                        </li>
                        <li className="flex gap-x-3">
                            <CheckIcon className="h-6 w-5 flex-none text-acc" />
                            Upto 100 messages per document
                        </li>
                        <li className="flex gap-x-3">
                            <CheckIcon className="h-6 w-5 flex-none text-acc" />
                            Full Fower AI Functionality with Memory Recall
                        </li>
                        <li className="flex gap-x-3">
                            <CheckIcon className="h-6 w-5 flex-none text-acc" />
                            Advanced Analytics
                        </li>
                        <li className="flex gap-x-3">
                            <CheckIcon className="h-6 w-5 flex-none text-acc" />
                            24-hour support response time
                        </li>
                    </ul>
                    <Button className="bg-black/50 w-full text-white shadow-md shadow-black hover:bg-black/40 mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/90 hover:translate-y-1 hover:scale-95 transition-all duration-200" disabled={loading || isPending} onClick={handleUpgrade}>
                        {isPending || loading ? "Loading..." : hasActiveMembership ? "Manage Plan" : "Upgrade To Pro"}
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}
export default PricingPage