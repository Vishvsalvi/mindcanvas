import BlogCard from "@/components/BlogCard";
import { Card } from "@/components/ui/card";
import { Linkedin, Instagram, Github, Twitter, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import prisma from "./db";

export default async function Home() {

  const blogs = await prisma.blog.findMany({
    where: { isDraft: false },
    include: { author: true },
  });

  
  
  return (
    <main>
      <section className="text-center sm:text-start relative top-12 sm:mx-36 font-bold text-3xl whitespace-nowrap">
        <h1>My Feed</h1>
      </section>

      <section className="lg:px-20 relative top-28 mx-6 md:mx-14 lg:mx-12">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-4">
            {
              blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  content={blog.content}
                  coverImageUrl={blog.coverImageUrl ?? ''}
                  authorId={blog.authorId}
                  isDraft={blog.isDraft}
                  tags={blog.tags}
                  authorName={blog.author.name}
                  authorImage={blog.author.profileImageUrl}
                  publishedAt={blog.createdAt}
                />
              ))
            }
          </div>

          <div className="space-y-6 ">
            <div className="rounded-lg ">
              <Card className="font-bold px-4 py-6 text-xl lg:w-[85%]  text-gray-800 mb-2">
                <h1 className="mb-5" >
                  Newly Published Articles
                </h1>

                <ul>
                  <li className="py-3">
                    <div>
                      <h1 className="font-semibold text-sm text-gray-700">From Darkness to Light: A Journey of Hope and Triumph.</h1>
                      <h2 className="text-gray-500 text-sm py-2 font-medium">Written by: Vishv Salvi  <span className="inline-block mx-2 font-bold opacity-50 ml-0">·</span>85 reads 5 comments</h2>

                    </div>
                  </li>
                  <li className="py-3">
                    <div>
                      <h1 className="font-semibold text-sm text-gray-700">From Darkness to Light: A Journey of Hope and Triumph.</h1>
                      <h2 className="text-gray-600 text-sm py-1 font-medium">Written by: Vishv Salvi . 30 likes </h2>
                    </div>
                  </li>

                </ul>


              </Card>
              <Card className="px-4 py-6 text-xl lg:w-[85%] mb-1 text-gray-700 bg-slate-50 text-center">
                <h1 className="mb-5 font-medium" >
                  Connect with me
                </h1>

                <ul className="flex w-full justify-center gap-4" >
                  <li className="py-3">
                    <Link target="_blank"  href='https://www.linkedin.com/in/vishvsalvi/'>
                      <Linkedin/>
                    </Link>
                  </li>
                  <li className="py-3">
                    <Link target="_blank" href="https://www.github.com/vishvsalvi">
                      <Github/>
                    </Link>
                  </li>

                  <li className="py-3">
                    <Link target="_blank" href="https://x.com/SalviVishv">
                      <Twitter/>
                    </Link>
                  </li>

                  <li className="py-3">
                    <Link target="_blank" href="https://www.instagram.com/vishvsalvi/" >
                      <Instagram/>
                    </Link>
                  </li>

                </ul>

              </Card>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
