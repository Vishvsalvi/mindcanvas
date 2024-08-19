"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { getBlogById } from '@/app/actions/user';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { formatDateToLongString } from '@/app/utils/dateConvertion';
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {getUserProfileImage} from "@/app/actions/user"
import Link from "next/link";

interface Blog {
    coverImageUrl?: string | undefined;
    title: string;
    content: string;
    createdAt: Date;
    authorId: number;
}

export default function Page({ params }: { params: { blogId: string } }) {
    const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);
    const { data: session } = useSession();
    const [blog, setBlog] = useState<Blog | null>(null);

    const [userData, setUserData] = useState<any | null>({
        name: "",
        image: "",
    });

    useEffect(() => {
        const fetchBlog = async () => {
            const blogData = await getBlogById(Number(params.blogId));
            const user = await getUserProfileImage(Number(blogData.authorId));
            setUserData(
                {
                    name: user.name,
                    image: user.image
                }
            );
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
                    {/* <div className="w-full sm:w-auto rounded-full">
                    </div> */}
                        <Link href={`/viewprofile/${blog.authorId}`} >
                    <div className="text-gray-600 text-lg w-full sm:w-auto mt-2 sm:mt-0 sm:ml-4 flex items-center justify-center gap-2">
                        <Avatar>
                            <AvatarImage className='object-cover' src={`https://res.cloudinary.com/vishvsalvi/image/upload/v1719501252/${userData ? userData.image : "rc2mbagu5d4m36hk3buw"}.png`} />
                            <AvatarFallback>{session?.user?.name}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold">{userData.name}</span>
                    </div>
                        </Link>
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
        <div className="flex flex-col space-y-5 w-full items-center">
            <Skeleton className="mt-5 h-[30rem] md:w-[45rem] w-[30rem] rounded-xl" />
            <div className="space-y-2 mx-14">
                <Skeleton className="h-6 md:w-[40rem] w-[20rem]" />
                <Skeleton className="h-6 md:w-[45rem] w-[15rem]" />
                <Skeleton className="h-6 md:w-[40rem] w-[20rem]" />
                <Skeleton className="h-6 md:w-[45rem] w-[15rem]" />

            </div>
        </div>
    )
}