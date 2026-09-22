import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
import { useAuth } from "../context/AuthProvider.jsx";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const [show, setShow] = useState(false);

  const {profile, isAuthenticated, setIsAuthenticated} = useAuth();
  console.log(profile);  //Undefine
  
  const navigate = useNavigate();

  const handleLogout = async (e) =>{
        e.preventDefault();
        try {
            const {data} = await axios.get("http://localhost:4001/api/users/logout",{
                withCredentials: true,
            })
            setIsAuthenticated(false);
            navigate("/login");
            toast.success(data?.response?.message || "Logout successfully");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Logout failed");
        }
  }
  return (
    <>
      <nav className="shadow-lg px-4 py-3">
        <div className="flex items-center justify-between container max-w-7xl mx-auto">
           <div className="font-semibold text-xl">
             Cilli<span className="text-blue-500">Blog</span>
           </div>

          {/* Desktop */}
          <div className=" mx-6">
            <ul className="hidden md:flex space-x-6 select-none">
              <Link to="/" className="hover:text-blue-500">
                HOME
              </Link>
              <Link to="/blogs" className="hover:text-blue-500">
                BLOGS
              </Link>
              <Link to="/creators" className="hover:text-blue-500">
                CREATORS
              </Link>
              <Link to="/about" className="hover:text-blue-500">
                ABOUT
              </Link>
              <Link to="/contact" className="hover:text-blue-500">
                CONTACT
              </Link>
            </ul>
            <div className="md:hidden" onClick={() => setShow(!show)}>
              {show ? <IoCloseSharp size={24} /> : <AiOutlineMenu size={24} />}
            </div>
          </div>

          <div className="flex space-x-2 select-none">
            {
            isAuthenticated && profile?.role === "admin" ? (
              <Link
              to="/dashboard"
              className="bg-blue-600 text-white font-semibold hover:bg-blue-800 duration-300 px-4 py-2 rounded-sm"
              >
                DASHBOARD
              </Link>
            ) : (
              ""
            )}            
              {
                !isAuthenticated ? (
                  <Link
                  to="/login" 
                  className="bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded-sm"
                  >
                    LOGIN
                  </Link>
                ) : (
                  <div>
                    <button onClick={handleLogout} className="bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded-sm">
                      LOGOUT
                    </button>
                  </div>
                )
              }
            
          </div>
        </div>

          {/* Mobile navbar */}
          {show && (
            <div className="bg-white">
              <ul className="flex flex-col h-screen items-center justify-center space-y-3 md:hidden text-xl ">
                <Link to="/"  onClick={()=> setShow(!show)} smooth="true" duration="500" offset={-70} activeClass="active" >HOME</Link>
                <Link to="/blogs"  onClick={()=> setShow(!show)} smooth="true" duration="500" offset={-70} activeClass="active"  >BLOGS</Link>
                <Link to="/creators"  onClick={()=> setShow(!show)} smooth="true" duration="500" offset={-70} activeClass="active"  >CREATORS</Link>
                <Link to="/about"  onClick={()=> setShow(!show)} smooth="true" duration="500" offset={-70} activeClass="active"  >ABOUT</Link>
                <Link to="/contact"  onClick={()=> setShow(!show)} smooth="true" duration="500" offset={-70} activeClass="active"  >CONTACT</Link>
              </ul>
            </div>
          )}
      </nav>
    </>
  )
}

export default Navbar