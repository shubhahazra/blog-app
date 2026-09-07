import React from "react";
import { useAuth } from "../context/AuthProvider";

function About() {
  const { profile } = useAuth();
  console.log(profile);
  return (
    <div className="container mx-auto my-12 p-4 space-y-9">
      <h1 className="text-2xl font-bold mb-6">About</h1>
      <p>
        This is{" "}
        <strong className="text-blue-800 font-semibold hover:scale-105 duration-500">
          {profile?.user?.name}
        </strong>{" "}
        Welcome to CilliBlog — a simple and engaging platform built for people who love to read, 
        write, and share ideas. <br /><br />

        CilliBlog is a modern blogging platform where users can explore interesting articles, 
        share their thoughts, and connect through the power of content. Whether you're passionate 
        about technology, programming, lifestyle, education, or everyday experiences, CilliBlog provides 
        a place to express your ideas and discover something new.
      </p>
      <h2 className="font-semibold text-blue-800 text-xl">
        What We Offer:
      </h2>
      <p>
        CilliBlog is designed with simplicity and user experience in mind. 
        Users can create their own blog posts, update their content, manage their blogs, 
        and explore articles shared by others. <br /><br />

        Our goal is to make blogging accessible and enjoyable while providing a clean, 
        responsive, and user-friendly experience across different devices.
      </p>
      <h2 className="font-semibold text-blue-800 text-xl">
        Our Technology:
      </h2>
      <p>
        CilliBlog is built using modern web technologies, with a focus on creating a smooth and reliable full-stack experience.<br /><br />

        <b>Frontend:</b> React.js, JavaScript, HTML5, Tailwind CSS<br /><br />

        <b>Backend:</b> Node.js, Express.js<br /><br />

        <b>Database:</b> MongoDB<br /><br />

        <b>Other Technologies:</b> REST APIs, JWT Authentication, Cloudinary, Axios<br /><br />

        These technologies work together to provide features such as user authentication, blog creation and management, image uploads, and dynamic content. 
      </p>
      <h2 className="font-semibold text-blue-800 text-xl">
        Why CilliBlog?:
      </h2>
      <p>
        We believe everyone has a story, an idea, or knowledge worth sharing.<br /><br />

        CilliBlog was created to provide a space where writers can turn their ideas 
        into meaningful content and readers can discover fresh perspectives. From a simple 
        thought to a detailed technical article, every post has the potential to inform, inspire, or start a conversation.
      </p>
      <h2 className="font-semibold text-blue-800 text-xl">
        Our Vision:
      </h2>
      <p>
        Our vision is to continue improving CilliBlog into a welcoming blogging community where people can freely share knowledge, experiences, and creativity.<br /><br />

        We are continuously learning, experimenting with new technologies, and improving the platform to make the blogging experience better for everyone.
      </p>
      <h2 className="font-semibold text-blue-800 text-xl">
        Built With Passion:
      </h2>
      <p>
        CilliBlog is more than just a blogging website — it is a project built with curiosity, learning, and a passion for web development.<br /><br />

        Every feature is an opportunity to learn something new, solve a problem, and create a better digital experience.<br /><br />

        <b>Write. Share. Explore.</b> 
      </p>
    </div>
  );
}

export default About;