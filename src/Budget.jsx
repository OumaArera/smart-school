import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios to send data to the backend

const Budget = () => {
  // Initial state for the budget form
  const [budget, setBudget] = useState({
    category: "",
    items: [{ reason: "", unit: "", costPerUnit: "", quantity: "", total: 0 }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // State to store the list of created budgets and their statuses
  const [createdBudgets, setCreatedBudgets] = useState([]);
  
  // Fetch budgets created by the user from the backend (example)
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get("/api/budgets"); // Replace with your actual API endpoint
        if (response.status === 200) {
          setCreatedBudgets(response.data); // Assuming the response returns an array of budgets
        }
      } catch (error) {
        console.error("Error fetching budgets:", error);
        setErrorMessage("An error occurred while fetching your budgets.");
      }
    };

    fetchBudgets();
  }, []);

  // Handle input changes for the main category and items
  const handleInputChange = (e, index, field) => {
    const { value } = e.target;
    const updatedItems = [...budget.items];
    if (index === undefined) {
      setBudget({ ...budget, [field]: value });
    } else {
      updatedItems[index][field] = value;
      if (field === "costPerUnit" || field === "quantity") {
        updatedItems[index].total = updatedItems[index].costPerUnit * updatedItems[index].quantity;
      }
      setBudget({ ...budget, items: updatedItems });
    }
  };

  // Add a new item to the list
  const handleAddItem = () => {
    setBudget((prevBudget) => ({
      ...prevBudget,
      items: [
        ...prevBudget.items,
        { reason: "", unit: "", costPerUnit: "", quantity: "", total: 0 },
      ],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!budget.category || budget.items.some((item) => !item.reason || !item.costPerUnit || !item.quantity)) {
      setErrorMessage("Category, reason, cost per unit, and quantity are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Send budget data to the backend (example using axios)
      const response = await axios.post("/api/budget", budget); // Replace with your actual API endpoint

      if (response.status === 200) {
        setBudget({
          category: "",
          items: [{ reason: "", unit: "", costPerUnit: "", quantity: "", total: 0 }],
        });
        setErrorMessage("");
        alert("Budget submitted successfully.");
        // Fetch the updated list of budgets after submission
        const updatedResponse = await axios.get("/api/budgets");
        setCreatedBudgets(updatedResponse.data);
      }
    } catch (error) {
      console.error("Error submitting budget:", error);
      setErrorMessage("An error occurred while submitting the budget.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total cost for all items
  const calculateTotalCost = () => {
    return budget.items.reduce((total, item) => total + parseFloat(item.total || 0), 0).toFixed(2);
  };

  // Handle changing the status of a budget (approve/decline)
  const handleBudgetStatusChange = async (budgetId, status) => {
    try {
      const response = await axios.put("/api/budget-status", { budgetId, status });
      if (response.status === 200) {
        // Update the local state to reflect the changed status
        const updatedBudgets = createdBudgets.map((item) =>
          item.id === budgetId ? { ...item, status } : item
        );
        setCreatedBudgets(updatedBudgets);
        alert("Budget status updated successfully.");
      }
    } catch (error) {
      console.error("Error updating budget status:", error);
      alert("An error occurred while updating the budget status.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Your Budget</h1>

      <form onSubmit={handleSubmit}>
        {/* Category Input */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={budget.category}
            onChange={(e) => handleInputChange(e, undefined, "category")}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter budget category"
          />
        </div>

        {/* Dynamic Items Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Budget Items</h2>
          {budget.items.map((item, index) => (
            <div key={index} className="mb-4 border p-4 rounded-lg shadow-sm">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Reason/Particulars</label>
                <input
                  type="text"
                  value={item.reason}
                  onChange={(e) => handleInputChange(e, index, "reason")}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter reason for the budget item"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item Name</label>
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => handleInputChange(e, index, "unit")}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cost per Unit (KES)</label>
                  <input
                    type="number"
                    value={item.costPerUnit}
                    onChange={(e) => handleInputChange(e, index, "costPerUnit")}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter cost per unit"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleInputChange(e, index, "quantity")}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Total</label>
                  <input
                    type="number"
                    value={item.total}
                    readOnly
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    placeholder="Total cost per item"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none mt-4"
          >
            Add Item
          </button>
        </div>

        {/* Review & Total */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-blue-600 mb-2">Total Cost: KES {calculateTotalCost()}</h3>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">
            <strong>{errorMessage}</strong>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Budget"}
          </button>
        </div>
      </form>

      {/* Display created budgets */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Your Created Budgets</h2>
        {createdBudgets.length > 0 ? (
          <table className="min-w-full border-collapse table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Total Cost</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {createdBudgets.map((budgetItem) => (
                <tr key={budgetItem.id}>
                  <td className="border px-4 py-2">{budgetItem.category}</td>
                  <td className="border px-4 py-2">{budgetItem.totalCost}</td>
                  <td className="border px-4 py-2">{budgetItem.status}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      onClick={() => handleBudgetStatusChange(budgetItem.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-2"
                      onClick={() => handleBudgetStatusChange(budgetItem.id, "declined")}
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No budgets created yet.</p>
        )}
      </div>
    </div>
  );
};

export default Budget;
