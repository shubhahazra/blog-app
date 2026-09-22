import React from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaHeart, } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t-2 border-gray-400 text-gray-600">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cilli<span className="text-blue-400">Blog</span>
            </h2>

            <p className="text-gray-500 leading-7 max-w-sm">
              A place to discover ideas, share knowledge, and tell your
              story. Write, explore, and inspire others with CilliBlog.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://github.com/shubhahazra"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center
                rounded-full bg-white border border-gray-200
                text-gray-600 hover:text-orange-500
                hover:border-orange-500 transition duration-300"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.linkedin.com/in/shubha-hazra/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center
                rounded-full bg-white border border-gray-200
                text-gray-600 hover:text-orange-500
                hover:border-orange-500 transition duration-300"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center
                rounded-full bg-white border border-gray-200
                text-gray-600 hover:text-orange-500
                hover:border-orange-500 transition duration-300"
              >
                <FaInstagram />
              </a>

              <a
                href="mailto:mhazra397@gmail.com"
                className="w-10 h-10 flex items-center justify-center
                rounded-full bg-white border border-gray-200
                text-gray-600 hover:text-orange-500
                hover:border-orange-500 transition duration-300"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-500 transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/blogs"
                  className="hover:text-blue-500 transition"
                >
                  All Blogs
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-500 transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-500 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              For Writers
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-500 transition"
                >
                  Write a Blog
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className="hover:text-blue-500 transition"
                >
                  My Blogs
                </Link>
              </li>

              <li>
                <Link
                  to="/blogs"
                  className="hover:text-blue-500 transition"
                >
                  Explore Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              Start Writing ✨
            </h3>

            <p className="text-gray-500 leading-6 mb-5">
              Have an idea worth sharing? Turn your thoughts into a blog
              and inspire others.
            </p>

            <Link
              to="/"
              className="nline-block bg-blue-400 hover:bg-blue-600
              text-white font-medium px-5 py-3 rounded-lg
              transition duration-300 shadow-sm"
            >
              Write a Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200">
        <div
          className="max-w-7xl mx-auto px-6 py-5
          flex flex-col md:flex-row items-center
          justify-between gap-3 text-sm text-gray-500"
        >
          <p>
            © 2026 CilliBlog. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Made with <FaHeart className="text-red-500" /> using MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;