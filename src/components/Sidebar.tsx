import DraftCard from "@/components/DraftCard";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetDescription,
} from "@/components/ui/sheet"

export default function Sidebar() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>Username's blog</SheetTitle>
                    <SheetDescription>
                        List of your drafts and published articles
                    </SheetDescription>
                </SheetHeader>
                <div className="my-5">
                    <h1 className="font-medium">My Drafts (1)</h1>
                    <ul className="max-h-52 overflow-y-auto">
                        <DraftCard />
                        <DraftCard />
                        <DraftCard />
                        <DraftCard />
                        <DraftCard />
                    </ul>
                </div>

                <div className="my-5">
                    <h1 className="font-medium">Published Articles (10)</h1>
                    <ul className="max-h-52 overflow-y-auto">
                        <DraftCard />
                        <DraftCard />
                        <DraftCard />
                        <DraftCard />
                        <DraftCard />
                    </ul>
                </div>

                <div className="my-5">
                    <Button variant="secondary"><Link href="/">Go Back to Feed</Link> </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
