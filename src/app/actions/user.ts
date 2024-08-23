"use server";
import prisma from "../db";
import cloudinary from "../../cloudinaryConfig";

// interface User {

// }

interface Blog {
  blogId: Number;
  title: String;
  content: String;
  coverImageUrl: String;
  authorId: Number;
  isDraft?: Boolean;
  tags?: String[];
}
export async function signUp(
  name: string,
  phoneNumber: string,
  email: string,
  password: string
) {
  const userExists = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { phoneNumber: phoneNumber }
      ]
    },
  });
  
  console.log(userExists);
  if (userExists) {
    return {
      message:
        "User already exists with the same email or phone number! Please sign in",
    };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      phoneNumber,
    },
  });

  return user;
}

export async function createPost(
  title: string,
  content: string,
  coverImageUrl: string,
  authorId: number,
  tags: string[] = [],
  preview: string
) {
  try {
    const newPost = await prisma.blog.create({
      data: {
        title,
        content,
        coverImageUrl,
        authorId,
        tags,
        preview,
      },
    });

    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function createDraftPost(
  blogId: number | undefined,
  title: string,
  content: string,
  coverImageUrl: string,
  authorId: number
) {
  try {
    if (blogId) {
      const updatedPost = await prisma.blog.update({
        where: { id: blogId },
        data: {
          isDraft: true,
        },
      });

      return updatedPost;
    }
  } catch (error) {
    console.error("Error creating draft post:", error);
    throw error;
  }
}

export async function createNewDraftBlog(authorId: number, title: string, content: string = "", coverImageUrl?: string, preview: string = "") {

  try {
    const newDraft = await prisma.blog.create({
      data: {
        title,
        content,
        coverImageUrl,
        authorId,
        isDraft: true,
        preview
      },
    });

    return newDraft;
  } catch (error) {
    console.error("Error creating new draft blog:", error);
    throw error;
  }
}

export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

export const checkEmptyBlogRecord = async (authorId: number) => {
  try {
    const emptyBlog = await prisma.blog.findFirst({
      where: {
        authorId,
        title: "",
        content: "",
        coverImageUrl: "",
      },
    });

    if (emptyBlog) {
      return emptyBlog.id;
    }

    return null;
  } catch (error) {
    console.error("Error checking empty blog record:", error);
    throw error;
  }
};

export const getUserData = async (email: string, userBlogs: boolean) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { blogs: userBlogs },
    });

    return user;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export const getBlogById = async (blogId: number) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    return blog;
  } catch (error) {
    console.error("Error getting blog by id:", error);
    throw error;
  }
};

export const updateUserData = async (
  email: string,
  name: string,
  description: string,
  profileImageUrl: string,
  aboutMe: string,
  githubLink: string,
  linkedinLink: string,
  twitterLink: string,
  instagramLink: string
) => {
  try {
    const updatedUser = await prisma.user.updateMany({
      where: { email },
      data: {
        name,
        description,
        profileImageUrl,
        githubLink,
        linkedinLink,
        twitterLink,
        instagramLink,
        aboutMe,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

export const getUserByid = async (id: number, getBlog: boolean) => {
  // console.log(id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { blogs: getBlog },
    });

    return user;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export const deleteBlogById = async (blogId: number, imageUrl?: string) => {
  try {
    if(imageUrl) {
      const deleteImage = await cloudinary.uploader.destroy(imageUrl);
    }
    const deletedBlog = await prisma.blog.delete({
      where: { id: blogId },
    });

    return deletedBlog;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

export const updateBlogById = async (
  blogId: number,
  title: string,
  content: string,
  coverImageUrl: string,
  tags?: string[]
) => {
  try {
    const updatedBlog = await prisma.blog.updateMany({
      where: { id: blogId },
      data: {
        title,
        content,
        coverImageUrl,
        tags,
      },
    });

    return updatedBlog;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

export const draftToPublished = async (blogId: number, tags: string[], preview: string) => {
  try {
    const updatedBlog = await prisma.blog.updateMany({
      where: { id: blogId },
      data: {
        tags,
        isDraft: false,
        preview
      },
    });

    return updatedBlog;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

export const getDrafts = async (authorId: number) => {
  try {
    const drafts = await prisma.blog.findMany({
      where: {
        authorId,
        isDraft: true,
      },
    });

    return drafts;
  } catch (error) {
    console.error("Error getting drafts:", error);
    throw error;
  }
};

export const getPublishedBlogsByTitleOrTag = async (search: string) => {
  try {

    if(search.length < 1) return [];

    const blogs = await prisma.blog.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            tags: {
              hasSome: [search],
            },
          },
        ],
        isDraft: false,
      },
    });

    return blogs;
  } catch (error) {
    console.error("Error getting blogs by title or tag:", error);
    throw error;
  }
};

export const getUserProfileImage = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      
    });

    return   {
      image: user?.profileImageUrl,
      name: user?.name
    };
  } catch (error) {
    console.error("Error getting user profile image:", error);
    throw error;
  }
}