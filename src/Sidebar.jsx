import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from './AuthContext';

const Sidebar = () => {
  const { auth } = useContext(AuthContext);
  
  if (!auth) return null;

  const { role } = auth;

  return (
    <div className="sidebar">
      <ul>
        {role === 'director' && (
          <>
            <li><NavLink to="/payment">Payment</NavLink></li>
            <li><NavLink to="/transaction-history">Transaction History</NavLink></li>
            <li><NavLink to="/student-balances">Student Balances</NavLink></li>
            <li><NavLink to="/reports">Reports</NavLink></li>
            <li><NavLink to="/budget">Budget</NavLink></li>
            <li><NavLink to="/budget-review">Budget Review</NavLink></li>
          </>
        )}

        {role === 'manager' && (
          <>
            <li><NavLink to="/payment">Payment</NavLink></li>
            <li><NavLink to="/transaction-history">Transaction History</NavLink></li>
            <li><NavLink to="/student-balances">Student Balances</NavLink></li>
            <li><NavLink to="/budget">Budget</NavLink></li>
          </>
        )}

        {role === 'accountant' && (
          <>
            <li><NavLink to="/payment">Payment</NavLink></li>
            <li><NavLink to="/transaction-history">Transaction History</NavLink></li>
            <li><NavLink to="/student-balances">Student Balances</NavLink></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
