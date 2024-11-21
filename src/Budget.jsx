import React, { useState, useEffect } from "react";

const BUDGET_URL = "https://smart-school-server-9aqb.onrender.com/users/budget";
const MY_BUDGET_URL = "https://smart-school-server-9aqb.onrender.com/users/budgets";

const Budget = () => {
  const [budget, setBudget] = useState({
    category: "",
    items: [{ reason: "", unit: "", costPerUnit: "", quantity: "", total: 0 }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingBudgets, setFetchingBudgets] = useState(false);  // New state to manage fetching
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) setToken(storedToken);
  }, []);

  // Fetch budgets by date range
  const fetchBudgetsByDateRange = async () => {
    if (!token) return;

    if (!startDate || !endDate) {
      setErrorMessage("Please select both start and end dates.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    setFetchingBudgets(true);  // Set fetching state to true

    try {
      const response = await fetch(`${MY_BUDGET_URL}?start=${startDate}&end=${endDate}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setBudgets(result.data);  // Update state with fetched budgets
        setSuccess(result.message);
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setErrorMessage(result.message);
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setErrorMessage("An error occurred while fetching budgets.");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setFetchingBudgets(false);  // Set fetching state to false after completion
    }
  };

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

  const handleAddItem = () => {
    setBudget((prevBudget) => ({
      ...prevBudget,
      items: [
        ...prevBudget.items,
        { reason: "", unit: "", costPerUnit: "", quantity: "", total: 0 },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    if (!budget.category || budget.items.some((item) => !item.reason || !item.costPerUnit || !item.quantity)) {
      setErrorMessage("Category, reason, cost per unit, and quantity are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(BUDGET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(budget),
      });

      const result = await response.json();
      if (result.success) {
        fetchBudgetsByDateRange(); // Refresh the budgets list after successful submission
        setBudget({
          category: "",
          items: [{ reason: "", unit: "", costPerUnit: "", quantity: "", total: 0 }],
        });
        setSuccess(result.message);
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setErrorMessage(result.message);
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error submitting budget:", error);
      setErrorMessage("An error occurred while submitting the budget.");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotalCost = () => {
    return budget.items.reduce((total, item) => total + parseFloat(item.total || 0), 0).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Your Budget</h1>

      <form onSubmit={handleSubmit}>
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
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="mt-2 py-2 px-4 text-white bg-blue-500 hover:bg-blue-700 rounded-md focus:outline-none"
          >
            Add Item
          </button>
        </div>

        <div className="mb-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`py-2 px-4 text-white rounded-md focus:outline-none ${
              isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Budget"}
          </button>
        </div>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        {success && (
          <div className="text-green-500 text-sm mb-4">{success}</div>
        )}
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-blue-600">Budgets</h2>
        <div className="mt-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mr-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mr-2"
          />
          <button
            onClick={fetchBudgetsByDateRange}
            disabled={fetchingBudgets}
            className={`py-2 px-4 text-white rounded-md focus:outline-none ${
              fetchingBudgets ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-700"
            }`}
          >
            {fetchingBudgets ? "Loading..." : "Search Budgets"}
          </button>
        </div>

        <div className="mt-4">
  {budgets.length === 0 ? (
    <p>No budgets found for the selected date range.</p>
  ) : (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border py-2 px-4">Category</th>
            <th className="border py-2 px-4">Item</th>
            <th className="border py-2 px-4">Cost Per Unit</th>
            <th className="border py-2 px-4">Quantity</th>
            <th className="border py-2 px-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => {
            const totalBudgetCost = budget.items.reduce(
              (sum, item) => sum + parseFloat(item.total || 0),
              0
            );

            return (
              <React.Fragment key={budget._id}>
                <tr className="bg-gray-100">
                  <td className="border py-2 px-4" colSpan="5">
                    <strong>{budget.category}</strong>
                  </td>
                </tr>
                {budget.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border py-2 px-4"></td>
                    <td className="border py-2 px-4">{item.unit}</td>
                    <td className="border py-2 px-4">{item.costPerUnit}</td>
                    <td className="border py-2 px-4">{item.quantity}</td>
                    <td className="border py-2 px-4">{item.total}</td>
                  </tr>
                ))}
                <tr className="bg-blue-100">
                  <td className="border py-2 px-4 font-bold" colSpan="4">
                    Total for {budget.category}
                  </td>
                  <td className="border py-2 px-4 font-bold">{totalBudgetCost.toFixed(2)}</td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <div className="text-right mt-4">
        <strong>
          Grand Total:{" "}
          {budgets
            .reduce(
              (grandTotal, budget) =>
                grandTotal +
                budget.items.reduce(
                  (sum, item) => sum + parseFloat(item.total || 0),
                  0
                ),
              0
            )
            .toFixed(2)}
        </strong>
      </div>
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default Budget;
