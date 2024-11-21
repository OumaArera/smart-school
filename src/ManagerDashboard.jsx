import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import Payment from './Payment'; 
import TransactionHistory from './TransactionHistory'; 
import StudentBalances from './StudentBalances'; 
import Budget from './Budget'; 
import Signup from "./Signup";
import CreateStudent from "./CreateStudent";

const ManagerDashboard = () => {
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
        <h2 className="text-2xl font-bold mb-8">Manager Dashboard</h2>

        {/* Sidebar Buttons */}
        <button
          onClick={() => setActiveTab('payment')}
          className="w-full py-2 px-4 mb-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
        >
          Payment
        </button>
        <button
          onClick={() => setActiveTab('transaction-history')}
          className="w-full py-2 px-4 mb-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
        >
          Transaction History
        </button>
        <button
          onClick={() => setActiveTab('student-balances')}
          className="w-full py-2 px-4 mb-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
        >
          Student Balances
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className="w-full py-2 px-4 mb-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
        >
          Budget
        </button>
        <button
          onClick={() => setActiveTab('create-student')}
          className="w-full py-2 px-4 mb-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
        >
          Create Student
        </button>
        <button
          onClick={() => setActiveTab('signup')}
          className="w-full py-2 px-4 mb-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
        >
          Create User
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
        {activeTab === 'payment' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Payment</h2>
            <Payment /> 
          </div>
        )}
        {activeTab === 'transaction-history' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Transaction History</h2>
            <TransactionHistory /> 
          </div>
        )}
        {activeTab === 'student-balances' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Student Balances</h2>
            <StudentBalances /> 
          </div>
        )}
        {activeTab === 'budget' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Budget</h2>
            <Budget /> 
          </div>
        )}
        {activeTab === 'signup' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Create User</h2>
            <Signup /> 
          </div>
        )}
        {activeTab === 'create-student' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Create Student</h2>
            <CreateStudent /> {/* Replace with actual Reports component */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;