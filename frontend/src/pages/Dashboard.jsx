import React, { useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import Sidebar from '../dashboard/Sidebar';
import MyProfile from "../dashboard/MyProfile.jsx";
import CreateBlog from "../dashboard/CreateBlog.jsx";
import UpdateBlog from "../dashboard/UpdateBlog.jsx";
import MyBlogs from "../dashboard/MyBlogs.jsx";
import { Navigate } from 'react-router-dom';
const Dashboard = () => {
  const {profile, isAuthenticated} = useAuth();
  const [component, setComponent] = useState("My Blogs");

  console.log(profile);
  console.log(isAuthenticated);
  
  if(!isAuthenticated){
    return <Navigate to={"/"} />
  }
  return (
    <div>
      <div><Sidebar component={component} setComponent={setComponent} />
        {
          component === "My Profile" ? (
            <MyProfile />
          ) : component === "Create Blog" ? (
            <CreateBlog />
          ) : component === "Update Blog" ? (
            <UpdateBlog />
          ) : (
            <MyBlogs />
          )}
      </div>
      <div></div>
    </div>
  )
}

export default Dashboard