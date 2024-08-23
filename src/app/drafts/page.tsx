
import React from 'react'
import { getDrafts, deleteBlogById } from '../actions/user';
import { Button } from '@/components/ui/button'
import { getServerSession } from "next-auth/next"
import { NEXT_AUTH } from "@/lib/auth";
import Link from 'next/link';
import Draft from '@/components/Draft';

// import { useCreateBlockNote } from "@blocknote/react";

export default async function Page() {

    // const editor = useCreateBlockNote();

    const session = await getServerSession(NEXT_AUTH);
    // console.log(session)
    const drafts = await getDrafts(Number(session?.user.sub));

    function formatDateToLongString(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    }

    return (
        <>
            <div className='max-w-5xl mx-auto px-8 mt-10 md:mt-20' >
                <div className='mx-8' >
                    <h1 className='font-extrabold text-3xl md:text-4xl md:leading-tight text-neutral-800 max-w-3xl'> Drafts </h1>
                    {
                        drafts.length == 0 && <div className='text-start mx-auto my-10' >
                            <h1 className='text-2xl font-semibold' >No drafts found</h1>
                        </div>
                    }
                </div>


                <div className="grid grid-cols-1 mt-10" >

                    {
                        drafts.map((draft, index) => (

                            <Draft key={index} title={draft.title} content={draft.content} date={formatDateToLongString(draft.createdAt)} id={draft.id} imageUrl={draft.coverImageUrl || null} />
                        ))
                    }

                </div>
            </div>

        </>
    )
}

