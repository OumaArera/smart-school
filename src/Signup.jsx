import React, { useState } from "react";
import logogi from './images/SCHOOL LOGO.PNG'; // Adjust the path as needed

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    pfNumber: "",
    role: "",
    username: "",
  });
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
      alert("Signup successful!");

      // Clear form data
      setFormData({
        name: "",
        nationalId: "",
        pfNumber: "",
        role: "",
        username: "",
      });
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Failed to signup. Please try again.");
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
          <h2 className="text-2xl font-bold">Create an Account</h2>

          <div className="space-y-4">
            {/* Name input */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg text-black"
              required
            />

            {/* National ID input */}
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              placeholder="National ID Number"
              className="w-full p-3 border rounded-lg text-black"
              required
            />

            {/* PF Number input */}
            <input
              type="text"
              name="pfNumber"
              value={formData.pfNumber}
              onChange={handleChange}
              placeholder="PF Number"
              className="w-full p-3 border rounded-lg text-black"
              required
            />

            {/* Role input */}
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Role"
              className="w-full p-3 border rounded-lg text-black"
              required
            />

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
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full p-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "SIGN UP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
