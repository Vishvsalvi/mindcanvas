"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { getBlogById } from '@/app/actions/user';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { formatDateToLongString } from '@/app/utils/dateConvertion';
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {getUserProfileImage} from "@/app/actions/user"

interface Blog {
    coverImageUrl?: string | undefined;
    title: string;
    content: string;
    createdAt: Date;
}

export default function Page({ params }: { params: { blogId: string } }) {
    const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);
    const { data: session } = useSession();
    const [blog, setBlog] = useState<Blog | null>(null);

    const [profileImageUrl, setProfileImageUrl] = useState<string | null | undefined>("");


    useEffect(() => {
        const fetchBlog = async () => {
            const blogData = await getBlogById(Number(params.blogId));
            setProfileImageUrl(await getUserProfileImage(Number(session?.user?.sub)));
            setBlog(blogData);
        };
        fetchBlog();
        
    }, [params.blogId]);



    if (!blog) return <BlogLoader />;

    return (
        <>

            <div className='grid grid-cols-1 my-20'>
                <div className='md:mx-auto mx-5 md:w-[75%]'>
                    <img
                        className="mx-auto"
                        src={`https://res.cloudinary.com/vishvsalvi/image/upload/v1719501252/${blog.coverImageUrl}.png`}
                        alt="Cover"
                    // width={1000}
                    // height={600}
                    />
                </div>

                <div className='mx-auto mt-8 text-center'>
                    <h1 className="w-full text-2xl sm:text-3xl md:text-4xl outline-none resize-none font-bold overflow-y-hidden">
                        {blog.title}
                    </h1>
                </div>

                <div className="mx-auto flex items-center py-5 flex-row w-full justify-center flex-wrap sm:flex-nowrap text-center sm:text-left">
                    <div className="w-full sm:w-auto rounded-full">
                        <Avatar>
                            <AvatarImage src={`https://res.cloudinary.com/vishvsalvi/image/upload/v1719501252/${profileImageUrl ? profileImageUrl : "rc2mbagu5d4m36hk3buw"}.png`} />
                            <AvatarFallback>{session?.user?.name}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="text-gray-600 text-lg w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4">
                        <span className="font-bold">{session?.user?.name}</span>
                    </div>
                    <div className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4">
                        <span>· {formatDateToLongString(blog.createdAt)} </span>
                    </div>
                </div>

                {/* <div className='xl:mx-[16rem] mx-10 prose lg:prose-xl mt-5' dangerouslySetInnerHTML={{ __html: blog.content }}></div> */}
                <div className='xl:mx-[16rem] mx-10 prose lg:prose-xl mt-5'>
                    <Editor
                        onChange={() => { }}
                        initialContent={blog.content} editable={false} />

                </div>

            </div>
        </>
    );
}

const BlogLoader = () => {
    return (
        <div className="flex flex-col space-y-3 w-full items-center">
            <Skeleton className="h-[30rem] w-[50rem] rounded-xl" />
            <div className="ml-[2.25rem] space-y-2 mx-10">
                <Skeleton className="h-6 w-[50rem]" />
                <Skeleton className="h-6 w-[45rem]" />
                <Skeleton className="h-6 w-[50rem]" />
                <Skeleton className="h-6 w-[45rem]" />

            </div>
        </div>
    )
}