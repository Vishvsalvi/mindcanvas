import React from 'react'
import { getUserByid } from '@/app/actions/user';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProfileBlog from '@/components/ProfileBlog';
import { Github, Linkedin, Twitter, Instagram, CalendarDays } from "lucide-react"
import { getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import { formatDateToLongString } from '@/app/utils/dateConvertion';

const getUserDetail = async (id: number) => {
    try {
        const user = await getUserByid(id, true);
        return user;
    } catch (error) {
        console.error("Error getting user data:", error);
        throw error;
    }
}

export default async function Page({ params }: { params: { id: number } }) {

    const user = await getUserDetail(Number(params.id));
    const session = await getServerSession(NEXT_AUTH);
    const isAdmin = Number(session?.user.sub) == Number(params.id);

    return (
        <div className='py-36'>
            {/* Page container */}
            <div className='border mx-auto w-full lg:w-[70%] py-5 px-4 md:px-24 rounded-lg'>
                <div className='flex flex-col md:flex-row items-center md:items-start'>
                    {/* Main container */}
                    <div className='border w-48 rounded-full overflow-hidden'>
                        <img className="w-48 h-48 object-cover mx-auto sm:mx-0 rounded-full" src={`https://res.cloudinary.com/vishvsalvi/image/upload/v1721191090/${user?.profileImageUrl ? user?.profileImageUrl: "rc2mbagu5d4m36hk3buw"}.png`} alt="Profile" />
                    </div>

                    <div className='md:px-5 py-5 text-center md:text-left'>
                        <div className='font-extrabold text-xl md:text-3xl tracking-tight'>{user?.name}</div>
                        <div className=' text-xl md:text-xl tracking-tight'>{user?.email}</div>


                        <br />
                        <span className='mt-5 block md:inline'>
                            {user?.description ? user?.description : 'No description'}
                        </span>
                    </div>
                    {
                        isAdmin && (<div className='pt-3'>
                            <Button  >
                                <Link className='flex' href={`/settings`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1 mt-[0.25em]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg> Edit

                                </Link>
                            </Button>
                        </div>
                        )
                    }

                </div>

                <div className='grid grid-cols-1 gap-6 py-10'>
                    <div className='border flex flex-col md:flex-row items-center justify-around p-4 rounded-md gap-2'>
                        <div className='text-center md:text-left flex gap-2'>

                            {
                                user?.githubLink && <Link href={user.githubLink} target='_blank' rel='noreferrer noopener'>
                                    <Github className='w-5 text-gray-500' />
                                </Link>
                            }

                            {
                                user?.linkedinLink && <Link href={user.linkedinLink} target='_blank' rel='noreferrer noopener'>
                                    <Linkedin className='w-5 text-gray-500' />
                                </Link>
                            }

                            {
                                user?.twitterLink && <Link href={user.twitterLink} target='_blank' rel='noreferrer noopener'>
                                    <Twitter className='w-5 text-gray-500' />
                                </Link>
                            }

                            {
                                user?.instagramLink && <Link className='' href={user.instagramLink} target='_blank' rel='noreferrer noopener'>
                                    <Instagram className='w-6 text-gray-500' />
                                </Link>
                            }

                        </div>
                        <div className='text-center md:text-right flex gap-2 text-gray-500 text-md'> <CalendarDays />  Member Since {formatDateToLongString(user?.createdAt || new Date())}</div>
                    </div>

                    <div className='border p-4 rounded-md'>
                        <h1 className='text-xl lg:text-2xl font-bold tracking-tight pb-2'>About Me</h1>
                        <p>
                            {user?.aboutMe ? user?.aboutMe : 'No data available'}
                        </p>
                    </div>

                    <div className='border p-4 rounded-md'>
                        {user?.blogs.length ?
                            user?.blogs.map((blog, index) => {
                                if (blog.isDraft) return null;

                                const shortDescription = blog.content.substring(0, 100);
                                return (
                                    <ProfileBlog
                                        key={index}
                                        title={blog.title}
                                        description={shortDescription}
                                        date={blog.createdAt}
                                        imageUrl={blog.coverImageUrl ?? ''}
                                        blogId={blog.id.toString()}
                                        isAuthor={isAdmin}
                                    />
                                );
                            }) : <div>No blogs available</div>
                        }


                    </div>
                </div>
            </div>
        </div>
    )
}
