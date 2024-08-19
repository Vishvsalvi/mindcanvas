"use client";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { CldUploadButton, CldImage } from "next-cloudinary";
import { createPost, createNewDraftBlog } from "@/app/actions/user";
import { deleteImage } from "../actions/user";
import { useRecoilState } from "recoil";
import { postState } from "@/app/store/atoms/editor";
import { useSession } from "next-auth/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { useState, useEffect, Suspense } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Plane, Shirt, Medal, Banknote, Cpu, PersonStanding, Soup, BriefcaseBusiness, Dumbbell, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import WriteblogLoader from "@/components/loaders/writeblogLoader";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import ButtonLoader from "@/components/loaders/ButtonLoader";


export default function Page() {
    const { toast } = useToast();
    const router = useRouter();

    const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

    const session = useSession();
    const user = session.data?.user as {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
        sub?: string | null | undefined;
    };

    const [postContent, setPostContent] = useRecoilState(postState);
    const [isDeleteLoader, setIsDeleteLoader] = useState(false);

    const handleUploadSuccess = (result: any) => {
        if (result.event === "success") {
            const newCoverImageId = result.info.public_id;
            setPostContent((prevState: any) => {
                return {
                    ...prevState,
                    coverImg: newCoverImageId,
                };
            });
        }
    };

    const handleRemoveImage = async (): Promise<void> => {
        try {
            setIsDeleteLoader(true);
            await deleteImage(postContent.coverImg);
            setPostContent((prevState: any) => {
                setIsDeleteLoader(false);
                return {
                    ...prevState,
                    coverImg: "",
                };
            });
        } catch (error) {
            console.error("Failed to delete image:", error);
        }
    };

    const publishPost = async () => {
        try {
            if (!postContent.title) {
                toast({
                    title: "Title is required",
                    description: "Please add a title to your blog post",
                });
                return;
            }

            if (!postContent.coverImg) {
                toast({
                    title: "Cover Image is required",
                    description: "Please add a cover image to your blog post",
                });
                return;
            }

            if (!postContent.editorContent) {
                toast({
                    title: "Content is required",
                    description: "Please add content to your blog post",
                });
                return;
            }

            if (!tags.length) {
                toast({
                    title: "Tags are required",
                    description: "Please add tags to your blog post",
                });
                return;
            }

            const newPost = await createPost(
                postContent.title,
                postContent.editorContent,
                postContent.coverImg,
                Number(user?.sub),
                tags
            );

            console.log(newPost);

            if (newPost) {
                toast({
                    title: "Post published successfully",
                    description: "Your post has been published successfully",
                });
                setPostContent({
                    title: "",
                    editorContent: "",
                    coverImg: "",
                });
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const publishToDraftBlog = async () => {
        try {
            if (!postContent.title) {
                toast({
                    title: "Title is required to save as draft",
                    description: "Please add a title to your draft blog post",
                });
                return;
            }

            const newPost = await createNewDraftBlog(
                Number(user?.sub),
                postContent.title,
                postContent.editorContent,
                postContent.coverImg,

            );

            if (newPost) {
                toast({
                    title: "Post saved as draft",
                    description: "Your post has been saved as draft",
                });
                setPostContent({
                    title: "",
                    editorContent: "",
                    coverImg: "",
                });
                router.push("/");
                router.refresh();
                return;
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const tagList = [
        { name: "Business", icon: <BriefcaseBusiness /> },
        { name: "Finance", icon: <Banknote /> },
        { name: "Sports", icon: <Medal /> },
        { name: "Travel", icon: <Plane /> },
        { name: "Food", icon: <Soup /> },
        { name: "Tech", icon: <Cpu /> },
        { name: "Lifestyle", icon: <Plane /> },
        { name: "Personal", icon: <PersonStanding /> },
        { name: "Fitness", icon: <Dumbbell /> },
        { name: "Fashion", icon: <Shirt /> },
    ];

    const [tags, setTags] = useState<string[]>([]);

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlNavbar = () => {
        if (window.scrollY > lastScrollY) {
            // scroll down
            setIsVisible(false);
        } else {
            // scroll up
            setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

    return (
        <Suspense fallback={<WriteblogLoader />}>
            <section className="">
                {/* The main navbar of editor starts here */}
                <div
                    className={`flex justify-between w-full fixed top-0 left-0 right-0 bg-white pl-[0.5rem] pr-[0.5rem] py-4 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
                        }`}
                >
                    <Link href="/" >
                        <Button variant="link" ><ArrowLeft className="w-10" /></Button>
                    </Link>

                    <div className="flex space-x-2">
                        <Button onClick={publishToDraftBlog} variant="outline">
                            Save as draft
                        </Button>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Publish</Button>
                            </DialogTrigger>
                            <DialogContent className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4">
                                <DialogHeader>
                                    <DialogTitle>Add tags</DialogTitle>
                                    <DialogDescription>
                                        Add tags to help readers find your article
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center space-y-2 sm:space-y-0">
                                    <div className="flex flex-row flex- flex-1 gap-4">
                                        <ToggleGroup type="multiple">
                                            {tagList.map((tag, index) => (
                                                <ToggleGroupItem
                                                    key={index}
                                                    value={tag.name}
                                                    onClick={(e) => {
                                                        if (tags.includes(tag.name)) {
                                                            setTags((prevState) =>
                                                                prevState.filter((item) => item !== tag.name)
                                                            );
                                                            return;
                                                        }
                                                        setTags((prevState) => [...prevState, tag.name]);
                                                    }}
                                                    className="w-full sm:w-auto p-2 m-1"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        {tag.icon}
                                                        <p>{tag.name}</p>
                                                    </div>
                                                </ToggleGroupItem>
                                            ))}
                                        </ToggleGroup>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={publishPost} type="submit" className="w-full sm:w-auto">
                                        Publish article
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                {/* Ends here */}

                <div className="mt-24 grid grid-cols-1">
                <div className="relative inline-block mx-5">
    {postContent.coverImg && (
        <>
            {/* Gray overlay for the disabled effect */}
            <div className={`absolute inset-0 ${isDeleteLoader?`bg-gray-100 opacity-50`:null}`}></div>

            {/* Centered ButtonLoader */}

            {
                isDeleteLoader && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ButtonLoader />
                    </div>
                )
            }

            
            {/* Image */}
            <img
                className="mx-auto block"
                src={`https://res.cloudinary.com/vishvsalvi/image/upload/v1719501252/${postContent.coverImg}.png`}
                alt="Cover"
            />

            {/* Remove button */}
            <Button
                variant="secondary"
                className="absolute bottom-5 right-4 xl:right-80"
                onClick={handleRemoveImage}
                disabled={isDeleteLoader}
            >
                {
                    isDeleteLoader ? "Removing..." : "Remove the Image"
                }
            </Button>
        </>
    )}
</div>





                    <div className=" xl:mx-[17rem] mx-14 mt-6">
                        <CldUploadButton
                            className={`text-sm font-medium border px-3 py-2 rounded-md hover:bg-gray-50 mb-5 ${postContent.coverImg ? "hidden" : ""
                                }`}
                            options={{ maxFiles: 1 }}
                            uploadPreset="ai7umnnt"
                            onUpload={handleUploadSuccess}
                        >
                            Add Cover
                        </CldUploadButton>

                        <textarea
                            className="md:mt-5 w-full text-2xl sm:text-3xl md:text-4xl outline-none resize-none font-bold overflow-y-hidden"
                            placeholder="Article Title"
                            value={postContent.title}
                            onChange={(e) => {
                                setPostContent((prevState: any) => {
                                    return {
                                        ...prevState,
                                        title: e.target.value,
                                    };
                                });
                            }}
                            name=""
                            id=""
                        ></textarea>
                        <Editor
                            initialContent={postContent.editorContent}
                            editable={true}
                            isWriteMode={true}
                            onChange={() => { }}
                        />
                        {/* <TipTapEditor  /> */}
                    </div>
                </div>
            </section>
        </Suspense>
    );
}
