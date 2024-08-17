"use client"
import React, { useEffect } from 'react'
import {Input} from "@/components/ui/input";
import {getPublishedBlogsByTitleOrTag} from "@/app/actions/user";

export default function page() {

  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);

  useEffect(() => {
    const timout = setTimeout( async (e: React.ChangeEvent<HTMLInputElement>) => {
      if(search.length < 1) return;
      const result = await getPublishedBlogsByTitleOrTag(search);
      setSearchResult(result);
      console.log(result);
    }, 500);
    return () => clearTimeout(timout);
  }, [search])

  return (
    <div>
        <Input
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Search blogs by title or tags' />
    </div>
  )
}
