"use client"
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface Blog {
    title: string
    description: string
    date: Date
    imageUrl: string
    blogId: string
    isAuthor: boolean
}

import { deleteBlogById } from "@/app/actions/user";
import { useRouter } from 'next/navigation';
import { formatDateToLongString } from '@/app/utils/dateConvertion';

export default function ProfileBlog({ title, description, date, imageUrl, blogId, isAuthor }: Blog) {

    const router = useRouter();

    const removeHtmlTags = (str: string) => {
        return str.replace(/<[^>]*>?/gm, '');
    }

    description = removeHtmlTags(description);

    const deleteBlog = async (blogId: string) => {
        try {
            await deleteBlogById(parseInt(blogId));
            router.refresh();
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    }

    return (
        <div className="flex flex-col xl:flex-row mx-5 items-center my-10 gap-10">
            <Link href={`http://localhost:3000/blog/${blogId}`} className="flex flex-col sm:flex-row w-full">
                <div className="px-4 py-2">
                    <h1 className="font-bold text-xl sm:text-2xl text-gray-900">
                        {title}
                    </h1>
                    <h2 className="font-normal text-sm py-[0.4rem]">Published on: {formatDateToLongString(date || new Date())}</h2>
                    <h2 className="text-gray-600 text-md hidden sm:block">
                        {description} ...
                    </h2>
                </div>
                <div className="w-full md:w-[50%] xl:w-[40%] lg:w-[50%] sm:w-[50%] pt-4 sm:py-0">
                    <img className="rounded-md w-full" src={`https://res.cloudinary.com/vishvsalvi/image/upload/v1719501252/${imageUrl}.png`} alt="Travel Image" />
                </div>
            </Link>
            
            {isAuthor && (
                <div className='md:grid flex gap-2'>
                    <Link className='border px-3 py-2 rounded-md text-center text-sm font-medium' href={`/editBlog/${blogId}`} >
                    Edit
                    </Link>
                    
                  
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Are you sure you want to delete this blog?</DialogTitle>
                                <DialogDescription>
                                    Blog will be permanently deleted. You can't undo this action.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 justify-end">
                                <Button onClick={() => deleteBlog(blogId)} type="submit" variant="destructive" className="px-3">
                                    Delete Blog
                                </Button>
                                <DialogClose asChild>
                                    <Button type="submit" variant="outline" className="px-3">
                                        Cancel
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
}
