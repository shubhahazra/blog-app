import { User } from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs';

import createTokenAndSaveCookies from '../jwt/AuthToken.js';
import generateOtp from "../utils/generateOtp.js";
import { AdminVerification } from "../models/adminVerification.model.js";
import sendEmail from "../utils/sendEmail.js";

export const register = async (req, res) => {

    try {
         
        // Check photo
        if (!req.files || Object.keys(req.files).length===0) {
            return res.status(400).json({ message: "User photo is required" });
        }

        const { photo } = req.files;

        // Check photo format
        const allowedFormats = ["image/jpeg", "image/png"];
        if (!allowedFormats.includes(photo.mimetype)) {
            return res.status(400).json({ message: "Invalid photo format. Only jpg and png are allowed" });
        }
        
        // Get register data
        const { email, name, password, phone, education, role } = req.body;

        // Check required fields
        if (!email || !name || !password || !phone || !education || !role || !photo) {
            return res.status(400).json({ message: "Please fill required field" });
        }

        // Convert email to lowerCase
        const lowerCase_email = email.trim().toLowerCase();
    
        // Check role
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({message: "Invalid role"});
        }

        // Check existing email
        const existingEmail = await User.findOne({email: lowerCase_email});
        if (existingEmail) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Check existing phone number
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({
                message: "User already exists with this phone number"
            });
        }

        // Upload photo in cloudinary
        const cloudnaryResponse = await cloudinary.uploader.upload(
            photo.tempFilePath
        );
        if (!cloudnaryResponse || cloudnaryResponse.error) {
            console.log(cloudnaryResponse.error);
            return res.status(400).json({message: "Photo upload failed"});
        }
    
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ==========================================
        // USER REGISTRATION
        // ==========================================
        if (role === 'user') {
            const newUser = new User({
                email: lowerCase_email, 
                name, 
                password: hashedPassword, 
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
                return res.status(201).json({ message: "User registerd successfully", 
                    user: {
                        _id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role,
                        photo: newUser.photo
                    }
                });
            }
        }

        // ==========================================
        // ADMIN REGISTRATION
        // ==========================================
        if (role === 'admin') {
            try {
                // Generate OTP
                const otp = generateOtp();
    
                // OTP expireAt after 5 minute
                const otpExpireAt = new Date(Date.now() + 5 *60 *1000);
    
                // Save temporary admin registration
                await AdminVerification.create({
                    email: lowerCase_email, 
                    name, 
                    password: hashedPassword, 
                    phone, 
                    education, 
                    role, 
                    photo: {
                        public_id: cloudnaryResponse.public_id,
                        url: cloudnaryResponse.url
                    },
                    otp,
                    otpExpireAt,
                });
    
                // Send OTP
                await sendEmail({
                    email: lowerCase_email,
                    subject: "CilliBlog Admin Verification OTP",
                    html: `
                        <h2>CilliBlog Admin Verification</h2>
    
                        <p>Hello ${name},</p>
    
                        <p>Your OTP for admin registration is:</p>
    
                        <h1>${otp}</h1>
    
                        <p>This OTP will expire in 5 minutes.</p>
    
                        <p>If you did not request this, please ignore this email.</p>
    
                        <br>
    
                        <p>Thanks,<br>CilliBlog</p>
                    `
                });
    
                return res.status(200).json({message: "OTP sent to your email", email: lowerCase_email})
            } catch (error) {
                console.log("ADMIN REGISTER ERROR:", error);
                return res.status(500).json({ message: error.message });
            }
        }
    } catch (error) {
        console.log("Register error: ", error);
        
        return res.status(500).json({message: "Internal Server error"});
    }
};

export const login = async (req, res) => {
    
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: "Please fill required fields" });
        }

        // Convert email to lowerCase
        const lowerCase_email = email.trim().toLowerCase();

        const user = await User.findOne({ email: lowerCase_email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (!user.password) {
            return res.status(400).json({ message: "User password is missing" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        if (user.role !== role) {
            return res.status(400).json({ message: `Given role ${role} not found` });
        }
        const token = await createTokenAndSaveCookies(user._id, res);

console.log("Token:", token);

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                photo: user.photo // *
            },
        });
    } catch (error) {
        return res.status(500).json({error: "Internal Server error"});
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt", { 
            httpOnly: true, 
            secure: false,
            sameSite: "strict",
        });
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getMyProfile = async (req, res) => {
    const user = await req.user;
    return res.status(200).json(user);
};

export const getAdmins = async (req, res) => {
    const admins = await User.find({ role: "admin" });
    return res.status(200).json(admins);
}

export const verifyAdminOTP = async (req, res) => {
    try {
        const {email, otp} = req.body;

        if (!email || !otp) {
            return res.status(400).json({message: "Email and OTP are required"});
        }

        // Find in AdminVerification
        const verification = await AdminVerification.findOne({ email }).select("+password");
        console.log(verification);
        
        if (!verification) {
            return res.status(404).json({message: "OTP verification request not found"});
        }

        // Check Expire time
        if (verification.otpExpireAt < Date.now()) {
            await AdminVerification.deleteOne({_id: verification._id});

            return res.status(400).json({ message: "OTP has expired. Try again" });
        }

        // Check OTP validation
        if (verification.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // OTP is currect
        const newAdmin = new User({
            email: verification.email,
            name: verification.name, 
            password: verification.password, 
            phone: verification.phone, 
            education: verification.education, 
            role: "admin", 
            photo: {
                public_id: verification.photo.public_id,
                url: verification.photo.url
            },
        })

        // Save in database
        await newAdmin.save();

        // Delete temporary verification data
        await AdminVerification.deleteOne({
            _id: verification._id
        })

        // Create JWT + Cookie
        const token = await createTokenAndSaveCookies(newAdmin._id, res);

        // Send wellcome email
        await sendEmail({
            email: newAdmin.email,
            subject: "Welcome to CilliBlog",
            html:`
                <h2>Welcome to CilliBlog, ${newAdmin.name}! 🎉</h2>

                <p>Your admin account has been successfully created.</p>

                <p>Your email has been verified successfully.</p>

                <p>
                    You can now read blogs and create your own blogs
                    on CilliBlog.
                </p>

                <br>

                <p>Thanks,<br>CilliBlog</p>
            `
        })

        return res.status(200).json( {message: "Admin account created successfilly", newAdmin, token: token });

    } catch (error) {
        console.log("Verification admin otp error: ", error);
        
        return res.status(500).json({message: "Internal server error"});
    } 
}