import React, { useState } from "react";
import { jwtDecode } from 'jwt-decode';
import logogi from './images/SCHOOL LOGO.PNG';

const LOGIN_URL="https://smart-school-server-9aqb.onrender.com/users/login";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.username)) {
      alert("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }
    try {
      // Replace the following with an actual API call
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
      });
      const result = await res.json();

      if(result.success){
        setFormData({ username: "", password: "" });
        const decodedToken = jwtDecode(data.token);
        const userDetails = {
          id: decodedToken.id,
          username: decodedToken.username,
          name: decodedToken.name,
          role: decodedToken.role
        };
        localStorage.setItem("userData", JSON.stringify(userDetails));
        localStorage.setItem("accessToken", data.token);
      }else{
        setMessage(result.message);
        setTimeout(() => setMessage(""), 5000);
      }
      
    } catch (error) {
      console.error("Submission failed:", error);
      setMessage("Failed to submit. Please try again.");
        setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left section */}
      <div className="w-1/2 bg-yellow-100 flex flex-col items-center justify-center">
        <img src={logogi} alt="School Logo" className="w-1/2 mb-4" />
        <h1 className="text-lg font-bold text-gray-800">LIVING FAITH SCHOOL</h1>
      </div>

      {/* Right section */}
      <div className="w-1/2 bg-[#1D276C] flex items-center justify-center text-white">
        <form className="w-3/4 space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold">Login into your account</h2>
          {message && <p className="text-red-500 mb-4">{message}</p>}
          <div className="space-y-4">
            {/* Username (Email) input */}
            <input
              type="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-3 border rounded-lg text-black"
              required
            />

            {/* Password input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 border rounded-lg text-black"
                required
              />
              <label className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show Password
              </label>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full p-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "LOGIN"}
          </button>

          {/* Forgot password */}
          <p className="text-center text-sm mt-4">
            <a href="#" className="underline">I can't access my account</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
