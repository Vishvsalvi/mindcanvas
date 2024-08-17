"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { updateState } from '@/app/store/atoms/editor';
import { useRecoilState } from 'recoil';
import { getBlogById, updateBlogById, draftToPublished, createDraftPost } from "@/app/actions/user";
import { CldImage, CldUploadButton } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { deleteImage } from "@/app/actions/user";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Plane, Shirt, Medal, Banknote, Cpu, PersonStanding, Soup, BriefcaseBusiness, Dumbbell, ArrowLeft } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import Sidebar from '@/components/Sidebar';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Blog {
  title: string
  description: string
  date: Date
  imageUrl: string
  blogId: string
  isAuthor: boolean
}

export default function Page({ params }: { params: { id: number } }) {

  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);
  const [postContent, setPostContent] = useRecoilState(updateState);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const { toast } = useToast();
  const router = useRouter();

  const getBlog = async () => {
    const blog = await getBlogById(Number(params.id));
    setPostContent((prevState: any) => ({
      ...prevState,
      title: blog?.title,
      editorContent: blog?.content,
      coverImg: blog?.coverImageUrl,
    }));
    return blog;
  }

  const handleUploadSuccess = (result: any) => {
    if (result.event === "success") {
      const newCoverImageId = result.info.public_id;
      setPostContent((prevState: any) => ({
        ...prevState,
        coverImg: newCoverImageId,
      }));
    }
  };

  const handleRemoveImage = async (): Promise<void> => {
    try {
      await deleteImage(postContent.coverImg);
      setPostContent((prevState: any) => ({
        ...prevState,
        coverImg: "",
      }));
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

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
    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  useEffect(() => {

    const updateBlog = setTimeout(async () => {
      try {
        const updatedBlog = await updateBlogById(Number(params.id), postContent.title, postContent.editorContent, postContent.coverImg);
        console.log("Updated Blog:", updatedBlog);
      } catch (error) {
        console.error("Error updating blog:", error);
      }
    }, 1000)

    return () => clearTimeout(updateBlog);
    // console.log("PostContent updated")
  }, [postContent])

  useEffect(() => {
    getBlog();
  }, []);

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

  const draftToPublishedBlog = async () => {

    try {

      if (!postContent.coverImg) {
        toast({

          title: "No cover image",
          description: "Please add a cover image to publish the blog.",
        })
        return;
      }

      if (!postContent.title) {
        toast({

          title: "No title",
          description: "Please add a title to publish the blog.",
        })
        return;
      }

      if (!postContent.editorContent) {
        toast({

          title: "No content",
          description: "Please add content to publish the blog.",
        })
        return;
      }

      if (tags.length === 0) {
        toast({

          title: "No tags",
          description: "Please add at least one tag to publish the blog.",
        })
        return;
      }

      const publishedBlog = await draftToPublished(Number(params.id), tags);

      if (publishedBlog) {
        toast({
          title: "Blog updated",
          description: "Your blog has been updated successfully.",

        });
        setPostContent({
          title: "",
          editorContent: "",
          coverImg: "",
          tags: [],
        });
        router.push(`/`);
      }

    } catch (error) {
      console.error("Error publishing blog:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish the blog. Please try again.",
      })
    }
  }

  const handleDraft = async () => {
    try {
      const draftBlog = await createDraftPost(Number(params.id), "", "", "", 1);
      if (draftBlog) {
        toast({
          title: "Blog saved as draft",
          description: "Your blog has been saved as draft successfully.",

        });
        router.push(`/`);
        return;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the blog as draft. Please try again.",
        variant: "destructive",
      })
      return;
    }
  }
  return (
    <>
      <div className={`flex justify-between w-full fixed top-0 left-0 right-0 bg-white pl-[0.5rem] pr-[0.5rem] py-4 z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
        }`}>
        <Link href="/" >
          <Button variant="outline" ><ArrowLeft className="w-10" /></Button>
        </Link>
        <div className="flex space-x-2">
          <Button
            onClick={handleDraft}
            variant="outline">Save as draft</Button>

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
                <div className="flex flex-row flex-1 gap-4">
                  <ToggleGroup type="multiple">
                    {tagList.map((tag, index) => (
                      <ToggleGroupItem
                        key={index}
                        value={tag.name}
                        onClick={(e) => {
                          if (tags.includes(tag.name)) {
                            setTags((prevState) => prevState.filter((item) => item !== tag.name));
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
                <Button onClick={draftToPublishedBlog} type="submit" className="w-full sm:w-auto">
                  Publish article
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mt-24 grid grid-cols-1">
        <div className="relative">
          {postContent.coverImg && (
            <>
              <CldImage
                className="mx-auto"
                src={`https://res.cloudinary.com/vishvsalvi/image/upload/v1719501252/${postContent.coverImg}.png`}
                alt="Cover"
                width={1000}
                height={600}
                crop="scale"
              />
              <Button
                variant="secondary"
                className="absolute bottom-5 right-5 md:right-72"
                onClick={handleRemoveImage}
              >
                Remove the Image
              </Button>
            </>
          )}
        </div>
        <div className="lg:mx-[15.2rem] mx-14 mt-6">
          <CldUploadButton
            className={`text-sm font-medium border px-3 py-2 rounded-md hover:bg-gray-50 mb-5 ${postContent.coverImg ? 'hidden' : ''}`}
            options={{ maxFiles: 1 }}
            uploadPreset="ai7umnnt"
            onUpload={handleUploadSuccess}
          >
            Add Cover
          </CldUploadButton>

          <textarea
            className="w-full text-2xl sm:text-3xl md:text-4xl outline-none resize-none font-bold overflow-y-hidden"
            placeholder="Article Title"
            value={postContent.title}
            onChange={(e) => {
              setPostContent((prevState: any) => ({
                ...prevState,
                title: e.target.value,
              }));
            }}
            name=""
            id=""
          ></textarea>
          <Editor onChange={() => { }} initialContent={postContent.editorContent} editable={true} />
        </div>
      </div>
    </>

  )
}

