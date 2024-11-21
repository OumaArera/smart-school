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

function App() {



  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/student-balances" element={<StudentBalances />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/budget-review" element={<BudgetReview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
