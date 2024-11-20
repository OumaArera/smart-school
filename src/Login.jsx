import React, { useState } from "react";
import logogi from './images/SCHOOL LOGO.PNG';

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Simulating a backend call
    try {
      // Replace the following with an actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Form submitted successfully!");

      // Clear inputs
      setFormData({ username: "", password: "" });
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit. Please try again.");
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
