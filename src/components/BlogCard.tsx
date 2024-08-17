import React from 'react';
import { Card } from "@/components/ui/card";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from './ui/aspect-ratio';

interface BlogCardProps {
  id: number;
  title: string;
  content: string;
  coverImageUrl: string;
  authorId: number;
  isDraft: boolean;
  tags: string[];
  authorName: string;
  authorImage: string | null;
  publishedAt: Date;
}

export default function BlogCard({id, title, content, coverImageUrl, authorId, tags, authorName, authorImage, publishedAt}: BlogCardProps) {

  const filterContent = content.replace(/<[^>]*>?/gm, '').slice(0, 200);
  const publishedDate = new Date(publishedAt);
  const formattedDate = publishedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  function formatDateToLongString(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

  return (
    <Card className='py-5'>
      <Link href={`viewprofile/${authorId}`} >
        <div className="flex mx-5 items-center">
          <div>
            <Avatar>
              <AvatarImage src={`https://res.cloudinary.com/vishvsalvi/image/upload/v1721191090/${authorImage}.png`} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="px-4 py-2">
            <h1 className="font-semibold">{authorName}</h1>
            <h2 className="font-normal text-xs">Published on: {formatDateToLongString(publishedAt)}</h2>
          </div>
        </div>
      </Link>
      <Link href={`blog/${id}`} >
        <div className="flex flex-col sm:flex-row mx-5 items-center">
          <div className='mb-4 sm:mb-0 sm:mr-4'>
            <h1 className='font-bold sm:text-xl text-gray-900 text-xl my-2 text-start'>
              {title}
            </h1>
            <h2 className='text-gray-600 text-sm hidden sm:block'>
              {filterContent}
            </h2>
          </div>

          <div className="w-full sm:w-[50%] lg:w-[60%] xl:w-[70%] aspect-w-16 aspect-h-9">
          <AspectRatio ratio={16 / 9}>
            <img className="rounded-md object-cover w-full h-full" src={`https://res.cloudinary.com/vishvsalvi/image/upload/v1721191090/${coverImageUrl}.png`} alt="Travel Image" />
          </AspectRatio>
          </div>
        </div>
      </Link>

      <div className="mx-5 mt-2 sm:mt-4 flex justify-end">
       {
          tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="mr-2">
              {tag}
            </Badge>
          ))
       }
      </div>
    </Card>
  );
}
