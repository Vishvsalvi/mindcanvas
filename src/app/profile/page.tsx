import { Button } from '@/components/ui/button';
import ProfileBlog from '@/components/ProfileBlog';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { getUserData } from '../actions/user';
import { Linkedin, Instagram, Github, Twitter, CalendarDays } from 'lucide-react';
import { Suspense } from 'react';


const getUserDetail = async (email: string) => {
    try {
        const user = await getUserData(email, true);
        return user;
    } catch (error) {
        console.error("Error getting user data:", error);
        throw error;
    }
}


export default async function Page() {

    const session = await getServerSession();
    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false
            }
        }
    }
    const user = await getUserDetail(session?.user?.email ?? '');

    return (
        <Suspense>

        <div className='py-36'>
            {/* <div className='border mx-auto w-full lg:w-[70%] py-5 px-4 md:px-24 rounded-lg'>
                <div className='flex flex-col md:flex-row items-center md:items-start'>
                    <div className='flex-shrink-0'>
                        <img className='w-24 h-24 md:w-40 md:h-40 rounded-full' src={`https://res.cloudinary.com/vishvsalvi/image/upload/v1721191090/${user?.profileImageUrl}.png`} alt="Profile" />
                    </div>

                    <div className='md:px-5 py-5 text-center md:text-left'>
                        <div className='font-extrabold text-xl md:text-3xl tracking-tight'>{user?.name}</div>
                        <div className=' text-xl md:text-xl tracking-tight'>{user?.email}</div>


                        <br />
                        <span className='mt-5 block md:inline'>
                            {user?.description ? user?.description : 'No description'}
                        </span>
                    </div>

                    <div className='pt-3'>
                        <Button  >
                            <Link className='flex' href={`profile/${user?.email}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1 mt-[0.25em]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg> Edit

                            </Link>
                        </Button>
                    </div>
                </div>

                <div className='grid grid-cols-1 gap-6 py-10'>
                    <div className='border flex flex-col md:flex-row justify-around p-4 rounded-md'>
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
                        <div className='text-center md:text-right flex gap-2 text-gray-500 font-medium'> <CalendarDays />  Member Since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Date not available'}</div>
                    </div>

                    <div className='border p-4 rounded-md'>
                        <h1 className='text-xl lg:text-2xl font-bold tracking-tight pb-2'>About Me</h1>
                        <p>
                            {user?.aboutMe ? user?.aboutMe : 'No data available'}
                        </p>
                    </div>

                    <div className='border p-4 rounded-md'>
                        {
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
                                        authorId={user.id.toString()}
                                    />
                                );
                            })
                        }


                    </div>
                </div>
            </div> */}
        </div>
        </Suspense>

    );
}
