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

function App() {

  const budgets = [
    {
      id: 1,
      category: "Office Supplies",
      items: [
        {
          reason: "Printer Paper",
          unit: "Pack",
          costPerUnit: 500,
          quantity: 5,
          total: 2500,
        },
        {
          reason: "Pens",
          unit: "Pack",
          costPerUnit: 150,
          quantity: 3,
          total: 450,
        },
      ],
    },
    {
      id: 2,
      category: "Software Subscriptions",
      items: [
        {
          reason: "Microsoft Office License",
          unit: "License",
          costPerUnit: 10000,
          quantity: 1,
          total: 10000,
        },
        {
          reason: "Zoom Subscription",
          unit: "License",
          costPerUnit: 2000,
          quantity: 2,
          total: 4000,
        },
      ],
    },
    {
      id: 3,
      category: "Employee Benefits",
      items: [
        {
          reason: "Health Insurance",
          unit: "Policy",
          costPerUnit: 15000,
          quantity: 2,
          total: 30000,
        },
        {
          reason: "Transport Allowance",
          unit: "Employee",
          costPerUnit: 1000,
          quantity: 5,
          total: 5000,
        },
      ],
    },
  ];




  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/student-balances" element={<StudentBalances />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/budget-review" element={<BudgetReview budgets={budgets}  />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
