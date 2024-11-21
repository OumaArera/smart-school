import React, { useState } from "react";
import axios from "axios";

const CREATE_STUDENT_URL = "https://smart-school-server-9aqb.onrender.com/users/student"; 

const CreateStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    admissionNumber: "",
    nationalId: "",
    sex: "male",
    course: "",
    department: "",
    years: "",
    semester: "",
    fees: ""
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("User is not authenticated.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        CREATE_STUDENT_URL,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setMessage("Student created successfully!");
        setFormData({
          name: "",
          admissionNumber: "",
          nationalId: "",
          sex: "male",
          course: "",
          department: "",
          years: "",
          semester: "",
          fees: ""
        });
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error creating student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Create New Student</h2>
        {message && (
          <p className={`text-center mb-4 ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="admissionNumber" className="block text-sm font-medium text-gray-700">Admission Number</label>
            <input
              type="text"
              id="admissionNumber"
              name="admissionNumber"
              value={formData.admissionNumber}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">National ID</label>
            <input
              type="text"
              id="nationalId"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sex</label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
            <input
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="years" className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              id="years"
              name="years"
              value={formData.years}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700">Semester</label>
            <input
              type="number"
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="fees" className="block text-sm font-medium text-gray-700">Fees</label>
            <input
              type="number"
              id="fees"
              name="fees"
              value={formData.fees}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-3 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
          >
            {isSubmitting ? "Submitting..." : "Create Student"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;
