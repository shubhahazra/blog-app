import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthProvider';

const Login = () => {

  const {isAuthenticated, setIsAuthenticated, setProfile} = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("");
  const [role, setRole]=useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email || !password || !role) {
        toast.error("Please fill all fields");
        setIsSubmitting(false);
        return;
    }

    try {
        const { data } = await axios.post(
            "http://localhost:4001/api/users/login",
            {
                email,
                password,
                role
            },
            {
                withCredentials: true
            }
        );

        console.log(data);

        toast.success(
            data.message || "User login successfully"
        );

        setIsAuthenticated(true);
        setProfile(data?.user);
        
      console.log(data?.user); // 
      console.log(isAuthenticated); // 

        setEmail("");
        setPassword("");
        setRole("");
        navigate("/");

    } catch (error) {

        console.log(error);
        console.log("Status:", error.response?.status);
        console.log("Backend message:", error.response?.data);

        toast.error(
            error.response?.data?.message || "Login failed"
        );
    } finally{      
      setIsSubmitting(false);
    }
};
  return (
    <div>
      <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='w-full max-w-md bg-white shadow-md rounded-lg p-8'>
          <form onSubmit={handleLogin}>
            <div className='flex items-center justify-center'>
              <div className="font-semibold text-xl">
                Cilli<span className="text-blue-500">Blog</span>
              </div>
            </div>
           <h1 className='text-xl font-semibold mb-6'>Login</h1>
           <select value={role} onChange={(e)=>setRole(e.target.value)} className='w-full p-2 mb-4 border rounded-md'>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
           </select>
           <div className='mb-4'>
            
            <input 
              type="email" 
              placeholder='Your Email Address'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className='w-full p-2 mb-4 border rounded-md'
            />
            <input 
              type="password" 
              placeholder='Your Password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className='w-full p-2 mb-4 border rounded-md'
            />
           </div>
          <p className='text-center mb-4'>
            New user?{" "}
            <Link to={"/register"} className='text-blue-600'>Register Now</Link>
          </p>
          <button 
            type='submit'
            disabled={isSubmitting}
            className='w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-white'
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login