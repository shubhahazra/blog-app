import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider.jsx";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const { setIsAuthenticated, setProfile, fetchBlogs } = useAuth();

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = sessionStorage.getItem("adminVerificationEmail");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    if (!email) {
      toast.error("Verification session expired. Please register again.");
      navigate("/register");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await axios.post(
        "http://localhost:4001/api/users/admin/verify-otp",
        {
          email,
          otp,
        },
        {
          withCredentials: true,
        }
      );

      console.log(data);

      // Admin account has now been created
      setIsAuthenticated(true);
      setProfile(data.newAdmin);
      await fetchBlogs();

      // Remove temporary email
      sessionStorage.removeItem("adminVerificationEmail");

      toast.success(
        data.message || "Admin registered successfully"
      );

      navigate("/");
    } catch (error) {
      console.log("OTP verification error:", error);
      console.log("Status:", error.response?.status);
      console.log("Backend message:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
        "OTP verification failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">

        <div className="flex items-center justify-center mb-4">
          <div className="font-semibold text-xl">
            Cilli<span className="text-blue-500">Blog</span>
          </div>
        </div>

        <h1 className="text-xl font-semibold mb-2">
          Verify Your Email
        </h1>

        <p className="text-gray-600 mb-6">
          Enter the 6-digit OTP sent to:
        </p>

        <p className="font-medium mb-4">
          {email}
        </p>

        <form onSubmit={handleVerifyOTP}>

          <input
            type="text"
            inputMode="numeric"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              const value = e.target.value;

              if (/^\d*$/.test(value)) {
                setOtp(value);
              }
            }}
            className="w-full p-3 mb-4 border rounded-md text-center tracking-widest text-lg"
          />

          <button
            type="submit"
            className={`w-full p-2 duration-300 rounded-md  ${
              isSubmitting ? "bg-gray-500 text-black cursor-not-allowed" : "bg-blue-500 hover:bg-blue-800 text-white"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default VerifyOTP;