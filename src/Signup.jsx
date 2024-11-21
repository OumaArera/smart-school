import React, { useState } from "react";
import logogi from './images/SCHOOL LOGO.PNG'; 

const SIGNUP_URL='https://smart-school-server-9aqb.onrender.com/users/signup';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    pfNumber: "",
    role: "",
    username: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState("");

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
      const res = await fetch(SIGNUP_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
      });
      const result = await res.json();

      if(result.success){
        setFormData({
          name: "",
          nationalId: "",
          pfNumber: "",
          role: "",
          username: "",
        });
        setMessage(result.message);
        setTimeout(() => setMessage(""), 5000);
      }else{
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
      
    } catch (error) {
      console.error("Signup failed:", error);
      setError("Failed to signup. Please try again.");
        setTimeout(() => setError(""), 5000);
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
          {message && <p className="text-green-600 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

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
