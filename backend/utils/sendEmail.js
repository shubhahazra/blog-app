import nodemailer from "nodemailer";
import transporter from "../config/nodemailer.config.js";

const sendEmail = async ({email, subject, html}) => {
   try {
     const mailOption = {
         from:`CilliBlog <${process.env.EMAIL_USER}>`,
         to: email,
         subject,
         html
     };
 
     await transporter.sendMail(mailOption);

     console.log("Email sent successfully");
   } catch (error) {
        console.log("Email sending failed:", error);
   }
};

export default sendEmail;