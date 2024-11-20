import React, { useState, useEffect } from "react";

const TransactionHistory = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactions, setTransactions] = useState([
    {
      date: "2024-11-01",
      amount: 5000,
      type: "MPESA",
      studentAdmissionNumber: "ADM001",
      transactionId: "TX123456",
      purpose: "Tuition Fees",
    },
    {
      date: "2024-11-02",
      amount: 3000,
      type: "Card",
      studentAdmissionNumber: "ADM002",
      transactionId: "TX123457",
      purpose: "Library Fees",
    },
    {
      date: "2024-11-03",
      amount: 7000,
      type: "Bank Transfer",
      studentAdmissionNumber: "ADM003",
      transactionId: "TX123458",
      purpose: "Hostel Fees",
    },
    {
      date: "2024-11-04",
      amount: 4500,
      type: "MPESA",
      studentAdmissionNumber: "ADM004",
      transactionId: "TX123459",
      purpose: "Examination Fees",
    },
    {
      date: "2024-11-05",
      amount: 8000,
      type: "Card",
      studentAdmissionNumber: "ADM005",
      transactionId: "TX123460",
      purpose: "Annual Subscription",
    },
    {
      date: "2024-11-06",
      amount: 2000,
      type: "MPESA",
      studentAdmissionNumber: "ADM006",
      transactionId: "TX123461",
      purpose: "Sports Fees",
    },
  ]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const itemsPerPage = 5;

  // Date validation
  const validateDates = () => {
    const today = new Date().toISOString().split("T")[0];
    if (startDate > today || endDate > today) {
      setErrorMessage("Dates cannot be in the future.");
      return false;
    }
    if (startDate > endDate) {
      setErrorMessage("Start date cannot be later than end date.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  // Fetch and filter transactions
  const fetchTransactions = () => {
    if (!validateDates()) return;

    const filtered = transactions.filter(
      (transaction) =>
        transaction.date >= startDate && transaction.date <= endDate
    );

    if (filtered.length === 0) {
      setErrorMessage("No transactions found for the selected date range.");
    } else {
      setErrorMessage("");
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  // Pagination logic
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate total amount for the current page
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageTransactions = filteredTransactions.slice(
      startIndex,
      endIndex
    );

    const total = currentPageTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    setTotalAmount(total);
  }, [currentPage, filteredTransactions]);

  return (
    <div className="max-w-4xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Transaction History
      </h1>

      {/* Date Filter Section */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">Start Date:</label>
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="block font-medium text-gray-700 mb-2">End Date:</label>
        <input
          type="date"
          name="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchTransactions}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Fetch Transactions
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-600 text-center font-medium mb-4">{errorMessage}</p>
      )}

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Admission No.</th>
              <th className="px-4 py-2">Transaction ID</th>
              <th className="px-4 py-2">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((transaction, index) => (
                  <tr
                    key={index}
                    className={`text-gray-700 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-2">{transaction.date}</td>
                    <td className="px-4 py-2">{transaction.amount}</td>
                    <td className="px-4 py-2">{transaction.type}</td>
                    <td className="px-4 py-2">{transaction.studentAdmissionNumber}</td>
                    <td className="px-4 py-2">{transaction.transactionId}</td>
                    <td className="px-4 py-2">{transaction.purpose}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredTransactions.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
              currentPage === 1 && "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Previous
          </button>
          <span className="font-medium text-gray-700">
            Page {currentPage} of {Math.ceil(filteredTransactions.length / itemsPerPage)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredTransactions.length / itemsPerPage)}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
              currentPage === Math.ceil(filteredTransactions.length / itemsPerPage) &&
              "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Total Amount */}
      <div className="mt-6 text-center font-bold text-gray-700">
        Total Amount Paid: <span className="text-green-600">KES {totalAmount}</span>
      </div>
    </div>
  );
};

export default TransactionHistory;
