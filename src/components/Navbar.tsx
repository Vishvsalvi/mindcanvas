"use client"

import React, { useState, useEffect } from "react";
import { Menu } from "@/components/ui/navbar-menu";
import { cn } from "@/app/utils/cn";
import Link from "next/link";
import { Button } from "./ui/button";
import CommandSearch from "./CommandSearch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signIn, useSession, signOut } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { usePathname } from 'next/navigation'
import { getUserProfileImage } from "@/app/actions/user"

export default function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);

    const session = useSession();
    const user = session.data?.user as { name?: string | null | undefined; email?: string | null | undefined; profileImageUrl?: string | null | undefined; sub?: string | null | undefined };
    const pathname = usePathname()
    
    const [image, setImage] = useState<string | undefined | null>("");

    const setImageUrl = async () => {
        const userData = await getUserProfileImage(Number(user?.sub))
        setImage(userData.image);
    }   
    
    useEffect(() => {
        if(!user){
            return;
        }
        setImageUrl();
    }, [user])
    
    if (pathname.startsWith("/editBlog") || pathname.startsWith("/signin") || pathname.startsWith("/signup") || pathname.startsWith("/write")) {
        return null;
    }
    
    return (
        <div className={cn(`sm:px-8 inset-x-0 mx-auto overflow-x-hidden bg-slate-50`, className)}>
            <Menu setActive={setActive}>
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center font-extrabold whitespace-nowrap">
                        <Link href="/">
                            Mind <span className="bg-black text-white px-1">Canvas</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                    </div>
                    <div className="flex items-center space-x-4">
                        {
                            pathname === "/" ? (
                                <div className="flex max-w-xs items-center space-x-2 sm:block hidden">
                                    <Button className="text-neutral-900 bg-white hover:bg-gray-100">
                                        <CommandSearch />
                                    </Button>
                                </div>
                            ) : null
                        }

                        {user ? (
                            <Link href="/writeblog">
                                <Button variant="outline">
                                    Write 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mx-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </Button>
                            </Link>
                        ) : (
                            <Button onClick={() => signIn()}>Login</Button>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage src={`https://res.cloudinary.com/vishvsalvi/image/upload/v1719501252/${image ? image : "rc2mbagu5d4m36hk3buw"}.png`} />
                                    <AvatarFallback>USER</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {user && (
                                    <Link href={`/viewprofile/${Number(user.sub)}`}>
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                    </Link>
                                )}
                                <Link href="/drafts">
                                    <DropdownMenuItem>Drafts</DropdownMenuItem>
                                </Link>
                                {user ? (
                                    <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
                                ) : null}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </Menu>
        </div>
    );
}
