import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthProvider';

const Register = () => {

  const {isAuthenticated, setIsAuthenticated, setProfile} = useAuth();
  const navigate = useNavigate();

  const [name, setName]=useState("");
  const [email, setEmail]=useState("");
  const [phone, setPhone]=useState("");
  const [password, setPassword]=useState("");
  const [role, setRole]=useState("");
  const [education, setEducation]=useState("");
  const [photo, setPhoto]=useState("");
  const [photoPreview, setPhotoPreview]=useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

const changePhotoHandler = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setPhoto(file);

  const reader = new FileReader();

  reader.onload = () => {
    setPhotoPreview(reader.result);
  };

  reader.readAsDataURL(file);
};

  const handleRegister=async (e)=>{
    e.preventDefault();
    setIsSubmitting(true);

    if (!email || !password || !role || !name || !phone || !education || !photo) {
      toast.error("Please fill all fields");
      setIsSubmitting(false);
      return;
    }
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('phone', phone)
    formData.append('password', password)
    formData.append('role', role)
    formData.append('education', education)
    formData.append('photo', photo)
    try {
      console.log("PHOTO:", photo);
      console.log("PHOTO NAME:", photo?.name);
      console.log("PHOTO TYPE:", photo?.type);
      const {data}=await axios.post('http://localhost:4001/api/users/register',
        formData,{
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

      console.log(data);

      toast.success(
            data.message || "User login successfully"
        );

      setIsAuthenticated(true);
      setProfile(data?.newUser);
      console.log(data?.newUser); // 
      console.log(isAuthenticated); //  

      setName("")
      setEmail("")
      setPhone("")
      setPassword("")
      setRole("")
      setEducation("")
      setPhoto("")
      setPhotoPreview("")
      navigate("/")
    } catch (error) {
      console.log(error);
      console.log("Status:", error.response?.status);
      console.log("Backend message:", error.response?.data);
      toast.error(
            error.response?.data?.message || "Login failed"
      );
    } finally {
        setIsSubmitting(false);
    }
  }
  return (
    <div>
      <div className='min-h-screen flex items-center justify-center bg-gray-100'>
        <div className='w-full max-w-md bg-white shadow-md rounded-lg p-8'>
          <form onSubmit={handleRegister}>
            <div className='flex items-center justify-center'>
              <div className="font-semibold text-xl">
                Cilli<span className="text-blue-500">Blog</span>
            </div>
            </div>
           <h1 className='text-xl font-semibold mb-6'>Register</h1>
           <select value={role} onChange={(e)=>setRole(e.target.value)} className='w-full p-2 mb-4 border rounded-md'>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
           </select>
           <div className='mb-4'>
            <input 
              type="text" 
              placeholder='Your Name'
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className='w-full p-2 mb-4 border rounded-md'
            />
            <input 
              type="email" 
              placeholder='Your Email Address'
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className='w-full p-2 mb-4 border rounded-md'
            />
            <input 
              type="number" 
              placeholder='Your Phone Number'
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
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
            <select 
            value={education} 
            onChange={(e)=>setEducation(e.target.value)}
            className='w-full p-2 mb-4 border rounded-md'
            >
              <option value="">Select Your Education</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="MBA">MBA</option>
              <option value="BBA">BBA</option>
           </select>
          <div className='flex items-center mb-4'>
            <div className='photo h-20 w-20 mb-4'>
              <img src={photoPreview ? `${photoPreview}` : "Photo"} alt="photo" />
            </div>
            <input type="file" onChange={changePhotoHandler} className='w-full p-2 border rounded-md'/>
          </div>
          <p className='text-center mb-4'>
            Already registered?{" "}
            <Link to={"/login"} className='text-blue-600'>Login Now</Link>
          </p>
          <button
           type='submit'
           disabled={isSubmitting}
           className='w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-white'
          >
            {isSubmitting ? "Register..." : "Register"}
          </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register