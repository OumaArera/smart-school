import React, { useEffect, useState } from "react";

const BUDGET_URL = "https://smart-school-server-9aqb.onrender.com/users/budget";
const BALANCE_URL = "https://smart-school-server-9aqb.onrender.com/users/balance";

const BudgetReview = () => {
  const [budgets, setBudgets] = useState([]);  // Initialize budgets as an empty array
  const [reviewState, setReviewState] = useState([]);  // Initialize reviewState as an empty array
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [balance, setBalance] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      pendingBudgets();
      accountBalance();
    }
  }, [token]);

  const accountBalance = async () => {
    if (!token) return;
    try {
      const response = await fetch(BALANCE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.success) {
        setBalance(result.data.balance);
      } else {
        setMessage(result.message);
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error) {
      console.log("Error: ", error);
      setMessage("Failed to get account balance");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const pendingBudgets = async () => {
    if (!token) return;

    try {
      const response = await fetch(BUDGET_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (result.success) {
        setBudgets(result.data);
        // Initialize reviewState with the fetched budget data
        const initialReviewState = result.data.map((budget) => ({
          ...budget,
          status: null,
          reason: "",
        }));
        setReviewState(initialReviewState);
      } else {
        setMessage(result.message);
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error) {
      console.log("Error: ", error);
      setMessage("Failed to get budgets");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleReasonChange = (e, index) => {
    const { value } = e.target;
    const updatedState = [...reviewState];
    updatedState[index].reason = value;
    setReviewState(updatedState);
  };

  const handleAction = async (e, index, action) => {
    e.preventDefault();
    if (!token) return;
    const updatedState = [...reviewState];
    updatedState[index].status = action;

    if (action === "decline" && !updatedState[index].reason) {
      alert("Please provide a reason for declining.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BUDGET_URL}/${updatedState[index].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action, reason: updatedState[index].reason }),
      });

      const result = await response.json();

      if (result.success) {
        setReviewState(updatedState);
        setSuccess(result.message);
        setTimeout(() => setSuccess(""), 5000);
        pendingBudgets();
        accountBalance();
      }
    } catch (error) {
      console.error("Error processing budget action:", error);
      setMessage("An error occurred while processing the action.");
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Review Budgets</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {balance !== null && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-blue-600">Account Balance: KES {balance}</h2>
        </div>
      )}

      <div>
        {reviewState.map((budget, index) => (
          <div key={budget.id} className="mb-6 p-6 border rounded-lg shadow-sm bg-gray-50">
            <h2 className="text-xl font-semibold text-blue-600">{budget.category}</h2>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700">Items:</h3>
              <ul className="list-inside list-disc pl-4">
                {budget.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-800">
                    <strong>{item.reason}:</strong> {item.unit} at KES {item.costPerUnit} x {item.quantity} = KES {item.total}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Reason for {budget.status === "approve" ? "Approval" : "Declining"}
              </label>
              <textarea
                value={budget.reason}
                onChange={(e) => handleReasonChange(e, index)}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide a reason for your decision..."
              />
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={(e) => handleAction(e, index, "approve")}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
              >
                {isSubmitting ? "Processing..." : "Approve"}
              </button>
              <button
                onClick={(e) => handleAction(e, index, "decline")}
                disabled={isSubmitting}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
              >
                {isSubmitting ? "Processing..." : "Decline"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetReview;
