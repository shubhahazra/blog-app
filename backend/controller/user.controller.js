import { User } from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';

import createTokenAndSaveCookies from '../jwt/AuthToken.js';
import { json } from "express";

export const register = async (req, res) => {

    try {
        
        if (!req.files || Object.keys(req.files).length===0) {
            return res.status(400).json({ message: "User photo is required" });
        }

        const {photo} = req.files;
        const allowedFormats = ["image/jpeg", "image/png"];
        if (!allowedFormats.includes(photo.mimetype)) {
            return res.status(400).json({ message: "Invalid photo format. Only jpg and png are allowed" });
        }
    
        const { email, name, password, phone, education, role } = req.body;
        if (!email || !name || !password || !phone || !education || !role || !photo) {
            return res.status(400).json({ message: "Please fill required field" });
        }
    
        const existingEmail = await User.findOne({email});
        if (existingEmail) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({
                message: "User already exists with this phone number"
            });
        }
    
        const cloudnaryResponse = await cloudinary.uploader.upload(
            photo.tempFilePath
        );
        if (!cloudnaryResponse || cloudnaryResponse.error) {
            console.log(cloudnaryResponse.error);
        }
    
        const hashedPasswored = await bcrypt.hash(password, 10);
        const newUser = new User({
            email, 
            name, 
            password: hashedPasswored, 
            phone, 
            education, 
            role, 
            photo: {
                public_id: cloudnaryResponse.public_id,
                url: cloudnaryResponse.url
            },
         });
        await newUser.save();
    
        if (newUser) {
            const token = await createTokenAndSaveCookies(newUser._id, res);
console.log("SignUp: ", token);
            return res.status(201).json({ message: "User registerd successfully", newUser, token: token });
        }
    } catch (error) {
        return res.status(500).json({error: "Internal Server error"});
    }
};

export const login = async (req, res) => {
    
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: "Please fill required fields" })
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (!user.password) {
            return res.status(400).json({ message: "User password is missing" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (user.role !== role) {
            return res.status(400).json({ message: `Given role ${role} not found` });
        }
        const token = await createTokenAndSaveCookies(user._id, res);

console.log("Token:", token);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                photo: user.photo // *
            },
            token: token,
        });
    } catch (error) {
        return res.status(500).json({error: "Internal Server error"});
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt", { httpOnly: true });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getMyProfile = async (req, res) => {
    const user = await req.user;
    res.status(200).json(user);
};

export const getAdmins = async (req, res) => {
    const admins = await User.find({ role: "admin" });
    res.status(200).json(admins);
}