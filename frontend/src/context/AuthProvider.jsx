import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log(loading);
  
  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4001/api/users/my-profile",
        {
          withCredentials: true,
        }
      );

      console.log(data);  //
      
      setProfile(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
      setProfile(null);
      setIsAuthenticated(false);
    } 
  };

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4001/api/blogs/all-blogs",
        {
          withCredentials: true,
        }
      );

      setBlogs(data);
    } catch (error) {
      console.log(error);
    } 
  } 

 useEffect(() => {
  const loadData = async () => {
    try {
      await Promise.all([
        fetchProfile(),
        fetchBlogs(),
      ]);
    } catch (error) {
      console.log("Load data error:", error);
    } finally {
        setLoading(false);
    }
  };

  loadData();
}, []);

console.log(loading);

  useEffect(() => {
    console.log("Blogs updated:", blogs);
  }, [blogs]);
  console.log(profile); //  
  console.log(blogs);
  console.log(isAuthenticated);
  

  return (
    <AuthContext.Provider
      value={{
        blogs,
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
        fetchBlogs,
        fetchProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);