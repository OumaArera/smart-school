import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const roles = {
    director: [
      { path: "/payment", label: "Payment" },
      { path: "/transaction-history", label: "Transaction History" },
      { path: "/student-balances", label: "Student Balances" },
      { path: "/reports", label: "Reports" },
      { path: "/budget", label: "Budget" },
      { path: "/budget-review", label: "Budget Review" },
    ],
    manager: [
      { path: "/payment", label: "Payment" },
      { path: "/transaction-history", label: "Transaction History" },
      { path: "/student-balances", label: "Student Balances" },
      { path: "/budget", label: "Budget" },
    ],
    accountant: [
      { path: "/payment", label: "Payment" },
      { path: "/transaction-history", label: "Transaction History" },
      { path: "/student-balances", label: "Student Balances" },
    ],
  };

  const menuItems = roles[user?.role] || [];

  return (
    <div className="h-screen w-60 bg-blue-900 text-white flex flex-col justify-between">
      <div>
        <div className="p-4 text-xl font-bold text-center border-b">Dashboard</div>
        <ul className="mt-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className="block p-3 rounded hover:bg-blue-700"
                activeClassName="bg-blue-700"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
