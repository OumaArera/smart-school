import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Payment from './Payment';
import TransactionHistory from './TransactionHistory';
import StudentBalances from './StudentBalances';
import Reports from './Report';
import Budget from './Budget';
import BudgetReview from './BudgetReview';
import Signup from './Signup';
import ProtectedRoute from './ProtectedRoute';
import DirectorDashboard from "./DirectorDashboard";
import ManagerDashboard from "./ManagerDashboard";
import AccountantDashboard from "./AccountantDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Role-based protected routes */}
          <Route path="/payment" element={<ProtectedRoute element={<Payment />} />} />
          <Route path="/transaction-history" element={<ProtectedRoute element={<TransactionHistory />} />} />
          <Route path="/student-balances" element={<ProtectedRoute element={<StudentBalances />} />} />
          <Route path="/reports" element={<ProtectedRoute element={<Reports />} roleRequired="manager" />} />
          <Route path="/budget" element={<ProtectedRoute element={<Budget />} roleRequired="manager" />} />
          <Route path="/budget-review" element={<ProtectedRoute element={<BudgetReview />} roleRequired="manager" />} />
          <Route path="/director-dashboard" element={<DirectorDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/accountant-dashboard" element={<AccountantDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
