import React, { useState } from "react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate inputs
    if (!currentPassword || !newPassword) {
      setErrorMessage("Both fields are required.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setErrorMessage("Access token is missing. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://smart-school-server-9aqb.onrender.com/users/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setErrorMessage(result.message || "Error changing password.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Change Password
      </h2>

      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="text-green-500 text-sm mb-4">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter current password"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter new password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`py-2 px-4 text-white rounded-md w-full focus:outline-none ${
            isSubmitting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
