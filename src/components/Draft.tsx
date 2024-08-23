"use client"
import React, {useState} from 'react'
import {deleteBlogById} from '@/app/actions/user';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";

export default function Draft( { title, content, date, id, imageUrl }: { title: string, content: string, date: string, id: number, imageUrl: string | null }) {

    const router = useRouter();

    const [isDeleted, setIsDeleted] = useState(false);
    const {toast} = useToast();

    const deleteBlog = async () => {
        setIsDeleted(true);
        if(imageUrl) {
            await deleteBlogById(id, imageUrl);
            setIsDeleted(false);
            toast({
                title: "Draft Deleted",
                description: "Your Draft has been deleted successfully."
            })
            router.refresh();
            return;
        }
        await deleteBlogById(id);
        toast({
            title: "Draft Deleted",
            description: "Your Draft has been deleted successfully."
        })
        setIsDeleted(false);
        router.refresh();
        
        return;

    }
  return (
    <div className='py-5 px-3 mx-5 rounded-md' >
            <div>
                <small className="md:border-l md:border-zinc-700 md:pl-2 text-zinc-500 block">{date}</small>
                <h2 className='font-medium text-xl my-2' > {title} </h2>
                <p className='text-sm' >Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque veniam temporibus asperiores eius voluptatibus? Dolorum ipsum voluptas saepe deserunt nulla.</p>

            </div>
            <div className='flex gap-2 my-2' >
                <Link href={`/editBlog/${id}`} >
                    <Button variant="outline">Edit</Button>
                </Link>
                <Button
                onClick={deleteBlog}
                disabled={isDeleted}
                variant="outline" className='hover:bg-red-500 hover:text-white'>
                    {isDeleted ? 'Deleting...' : 'Delete'}
                </Button>
            </div>

        </div>
  )
}
