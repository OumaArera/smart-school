import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Payment from "./Payment";
import TransactionHistory from "./TransactionHistory";
import StudentBalances from "./StudentBalances";
import Report from "./Report";
import Budget from "./Budget";
import BudgetReview from "./BudgetReview";
import Signup from "./Signup";
import Layout from "./Layout";
// import useAutoLogout from "./Logout";

const ProtectedRoute = ({ children, role }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData || (role && userData.role !== role)) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  // useAutoLogout();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/payment" element={<ProtectedRoute role="accountant"><Payment /></ProtectedRoute>} />
          <Route path="/transaction-history" element={<ProtectedRoute role="accountant"><TransactionHistory /></ProtectedRoute>} />
          <Route path="/student-balances" element={<ProtectedRoute role="accountant"><StudentBalances /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute role="director"><Report /></ProtectedRoute>} />
          <Route path="/budget" element={<ProtectedRoute role="manager"><Budget /></ProtectedRoute>} />
          <Route path="/budget-review" element={<ProtectedRoute role="director"><BudgetReview /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
