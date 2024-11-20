import React, { useState } from "react";

const Payment = () => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    paymentType: "MPESA",
    transactionId: "",
    purpose: "Tuition Fees",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  const students = {
    ADM001: { name: "John Doe", course: "Computer Science", year: "2", semester: "1" },
    ADM002: { name: "Jane Smith", course: "Mechanical Engineering", year: "3", semester: "2" },
    ADM003: { name: "Samuel Johnson", course: "Business Administration", year: "1", semester: "1" },
  };

  const handleFetchDetails = () => {
    const details = students[admissionNumber.toUpperCase()];
    if (details) {
      setStudentDetails(details);
      setSubmissionMessage("");
    } else {
      setStudentDetails(null);
      setSubmissionMessage("Student not found. Please check the admission number.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentDetails) {
      setSubmissionMessage("Please fetch student details first.");
      return;
    }
    if (paymentDetails.amount <= 0) {
      setSubmissionMessage("Amount must be greater than zero.");
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Submitted Data:", {
        ...paymentDetails,
        studentDetails,
      });
      setIsSubmitting(false);
      setSubmissionMessage("Payment details submitted successfully!");
      setStudentDetails(null);
      setAdmissionNumber("");
      setPaymentDetails({
        amount: "",
        paymentType: "MPESA",
        transactionId: "",
        purpose: "Tuition Fees",
      })
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">School Payment Portal</h1>

      {/* Fetch student details */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">Admission Number:</label>
        <input
          type="text"
          value={admissionNumber}
          onChange={(e) => setAdmissionNumber(e.target.value)}
          placeholder="Enter admission number"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleFetchDetails}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Fetch Student Details
        </button>
      </div>

      {/* Display student details */}
      {studentDetails && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <p><strong>Name:</strong> {studentDetails.name}</p>
          <p><strong>Course:</strong> {studentDetails.course}</p>
          <p><strong>Year:</strong> {studentDetails.year}</p>
          <p><strong>Semester:</strong> {studentDetails.semester}</p>
        </div>
      )}

      {/* Display submission message */}
      {submissionMessage && (
        <p
          className={`text-center font-medium ${
            submissionMessage.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {submissionMessage}
        </p>
      )}

      {/* Payment form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Amount:</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={paymentDetails.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Payment Type:</label>
          <select
            name="paymentType"
            value={paymentDetails.paymentType}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="MPESA">MPESA</option>
            <option value="Bank Deposit">Bank Deposit</option>
            <option value="Bankers Cheque">Bankers Cheque</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Transaction ID:</label>
          <input
            type="text"
            name="transactionId"
            value={paymentDetails.transactionId}
            onChange={handleInputChange}
            placeholder="Enter transaction ID (if applicable)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={["MPESA", "Bank Transfer"].includes(paymentDetails.paymentType)}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Purpose:</label>
          <select
            name="purpose"
            value={paymentDetails.purpose}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Tuition Fees">Tuition Fees</option>
            <option value="Activity Fees">Activity Fees</option>
            <option value="Lunch Fees">Lunch Fees</option>
            <option value="Graduation Fees">Graduation Fees</option>
            <option value="Reinstatement Fees">Reinstatement Fees</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 text-white font-medium rounded-lg ${
            isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
};

export default Payment;
