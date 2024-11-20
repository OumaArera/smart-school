import React, { useState } from "react";
import axios from "axios"; // Import axios to send data to the backend

const BudgetReview = ({ budgets }) => {
  const [reviewState, setReviewState] = useState(
    budgets.map((budget) => ({
      ...budget,
      status: null,
      reason: "",
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle changes in the approval/decline reason for each budget
  const handleReasonChange = (e, index) => {
    const { value } = e.target;
    const updatedState = [...reviewState];
    updatedState[index].reason = value;
    setReviewState(updatedState);
  };

  // Handle approve/decline action
  const handleAction = async (e, index, action) => {
    e.preventDefault();
    const updatedState = [...reviewState];
    updatedState[index].status = action;

    // Validate reason if declining
    if (action === "decline" && !updatedState[index].reason) {
      alert("Please provide a reason for declining.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/approve-decline-budget", {
        budgetId: updatedState[index].id,
        status: action,
        reason: updatedState[index].reason,
      });

      if (response.status === 200) {
        setReviewState(updatedState);
        alert("Budget action has been processed successfully.");
      }
    } catch (error) {
      console.error("Error processing budget action:", error);
      alert("An error occurred while processing the action.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Review Budgets</h1>

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
