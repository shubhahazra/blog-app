import mongoose from "mongoose";
import { Blog } from "../models/blog.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createBlog = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Blog Image is required" });
    }
    const { blogImage } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(blogImage.mimetype)) {
      return res.status(400).json({
        message: "Invalid photo format. Only jpg and png are allowed",
      });
    }
    const { title, category, about } = req.body;
    if (!title || !category || !about) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }
    if (about.length < 200) {
      return res.status(400).json({message: "About must be at least 200 characters"});
    }
    const adminName = req?.user?.name;    
    const adminPhoto = req?.user?.photo?.url;
    const createdBy = req?.user?._id;

    const cloudinaryResponse = await cloudinary.uploader.upload(
      blogImage.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
    }
    const blogData = {
      title,
      about,
      category,
      adminName,
      adminPhoto,
      createdBy,
      blogImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    };
    const blog = await Blog.create(blogData);

    return res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server error" });
  }
};

export const deleteBlog = async (req, res) => {
  const {id} = req.params;

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  await blog.deleteOne();
  return res.status(200).json({ message: "Blog deleted successfully" });
}

export const getAllBlogs = async (req, res) => {
  const allBlogs = await Blog.find();
  return res.status(200).json(allBlogs); 
}

export const getSingleBlog = async (req, res) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Blog id" });
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  return res.status(200).json(blog);
}

export const getMyBlogs = async (req, res) => {
  const createdBy = req.user._id;

  const myBlogs = await Blog.find({ createdBy })
  return res.status(200).json(myBlogs);
}

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Blog Id" });
    }
  
    const blog = await Blog.findById(id);
    if(!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const { title, about, category } = req.body;
  
    if (!title || !about || !category) {
      return res.status(404).json({message: "title, category & about are required fields"});
    }

    if (about.length < 200) {
      return res.status(400).json({message: "About must be at least 200 character"});
    }

    blog.title = title;
    blog.category = category;
    blog.about = about;


    if (req.files?.blogImage) {
     const newImage = await cloudinary.uploader.upload(
      req.files.blogImage.tempFilePath
     );
  
     if (blog.blogImage?.public_id) {
      await cloudinary.uploader.destroy(blog.blogImage?.public_id);
     }
  
     blog.blogImage = {
      public_id: newImage.public_id,
      url: newImage.secure_url
     };
    };
  
    await blog.save();
  
    return res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.log("Blog Update error: ", error);

    return res.status(500).json({ message: "Internal server error" })
  }
}