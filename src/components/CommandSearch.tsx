"use client"
import { useEffect, useState } from "react"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import DraftCard from "./DraftCard"

import Link from "next/link";
import { Card } from "./ui/card";
import { Input } from "@/components/ui/input";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { getPublishedBlogsByTitleOrTag } from "@/app/actions/user";

interface Blog {
  id: number;
  title: string;
  content: string;
  coverImageUrl: string | null;
  authorId: Number;
  isDraft?: boolean;
  tags?: string[];
}

export default function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<Blog[]>([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    const debounceSearch = setTimeout(async () => {

      const result = await getPublishedBlogsByTitleOrTag(search);
      setSearchResult(result);
      console.log(result);
    }, 500)

    return () => clearTimeout(debounceSearch);
  }, [search])

  return (
    <>
      <p className="text-sm font-normal text-muted-foreground flex items-center" onClick={() => setOpen(true)}>
        <MagnifyingGlassIcon className="mx-2 text-semibold" /> Search... {" "}
        <kbd className="mx-1 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-thin text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>

      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>

        {/* <CommandInput placeholder="Search by articles, author name or tags" /> */}
        <Input
          onChange={(e) => setSearch(e.target.value)}
          className="focus-visible:ring-0 border-none rounded-none" placeholder='Search blogs by title or tags' />
        <hr />

        <CommandList>
          {/* <CommandEmpty>No results found.</CommandEmpty> */}
          <CommandGroup className={`${searchResult.length > 0 ? "block" : "hidden"}`} heading="Articles">
            {
              searchResult.map((blog: Blog) => (
                <CommandItem key={blog.id}>
                  <SearchBlogCard
                    title={blog.title}
                    content={blog.content}
                    coverImageUrl={blog.coverImageUrl ?? ''}
                    blogId={blog.id}
                  />
                </CommandItem>
              ))
            }
          </CommandGroup>
          <CommandSeparator />



          {/* <CommandGroup heading="Profiles">
            <CommandItem>
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Mail</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup> */}

        </CommandList>
      </CommandDialog>
    </>
  )
}

const SearchBlogCard = (
  { title, content, coverImageUrl, blogId }: { title: string, content: string, coverImageUrl: string, blogId: number }
) => {
  return (
    <div>
      <Link href={`blog/${blogId}`} className="" >
        <div className="flex flex-col sm:flex-row mx-5 items-center">
          <div className="w-[50%]">
            <img className="rounded-md w-full" src={`https://res.cloudinary.com/vishvsalvi/image/upload/v1721191090/${coverImageUrl}.png`} alt="Travel Image" />
          </div>
          <div className='mb-4 sm:mb-0 sm:ml-4'>
            <h1 className='font-bold text-md text-gray-900'>
              {title}
            </h1>
            <h2 className='text-gray-600 text-xs hidden sm:block'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta, ipsum.
            </h2>
          </div>

        </div>
      </Link>

    </div>

  )
}