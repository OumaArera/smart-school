import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import Payment from './Payment';
import TransactionHistory from './TransactionHistory'; 
import StudentBalances from './StudentBalances'; 

const AccountantDashboard = () => {
  const [activeTab, setActiveTab] = useState('payment');
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-1/5 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Accountant Dashboard</h2>

        {/* Sidebar Buttons */}
        <button
          onClick={() => setActiveTab('payment')}
          className="w-full py-2 px-4 mb-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
        >
          Payment
        </button>
        <button
          onClick={() => setActiveTab('transaction-history')}
          className="w-full py-2 px-4 mb-4 rounded-lg bg-green-500 hover:bg-green-600 transition"
        >
          Transaction History
        </button>
        <button
          onClick={() => setActiveTab('student-balances')}
          className="w-full py-2 px-4 mb-4 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition"
        >
          Student Balances
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-4/5 p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
        {/* Render Components Based on Active Tab */}
        {activeTab === 'payment' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Payment</h2>
            <Payment /> {/* Replace with actual Payment component */}
          </div>
        )}
        {activeTab === 'transaction-history' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Transaction History</h2>
            <TransactionHistory /> {/* Replace with actual TransactionHistory component */}
          </div>
        )}
        {activeTab === 'student-balances' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Student Balances</h2>
            <StudentBalances /> {/* Replace with actual StudentBalances component */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountantDashboard;
