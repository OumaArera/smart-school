import React, { useState, useEffect } from "react";

const BUDGET_URL = "https://smart-school-server-9aqb.onrender.com/users/budget";
const MY_BUDGET_URL = "https://smart-school-server-9aqb.onrender.com/users/budgets";

const Budget = () => {
  const [budget, setBudget] = useState({
    category: "",
    items: [{ reason: "", unit: "", costPerUnit: "", quantity: "", total: 0 }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const fetchBudgetsByDateRange = async () => {
    if (!token) return;

    if (!startDate || !endDate) {
      setErrorMessage("Please select both start and end dates.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

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
        setBudgets(result.data);
        setSuccess("Budgets retrieved successfully!");
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setErrorMessage(result.message);
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setErrorMessage("An error occurred while fetching budgets.");
      setTimeout(() => setErrorMessage(""), 5000);
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
        fetchBudgetsByDateRange(); // Refresh the budgets list
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

        <div className="mb-6">
          <h3 className="text-xl font-bold text-blue-600 mb-2">Total Cost: KES {calculateTotalCost()}</h3>
        </div>

        {errorMessage && <div className="text-red-500 text-sm mb-4"><strong>{errorMessage}</strong></div>}
        {success && <div className="text-green-600 text-sm mb-4"><strong>{success}</strong></div>}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-md ${isSubmitting ? "bg-gray-400" : "bg-blue-500"} text-white hover:bg-blue-600 focus:outline-none`}
          >
            {isSubmitting ? "Submitting..." : "Submit Budget"}
          </button>
        </div>
      </form>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Fetch Budgets by Date</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={fetchBudgetsByDateRange}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none mt-4"
        >
          Fetch Budgets
        </button>

        {budgets.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Budgets:</h3>
            <ul className="list-disc list-inside">
              {budgets.map((budget, index) => (
                <li key={index}>
                  <strong>Category:</strong> {budget.category} | <strong>Total:</strong> KES {budget.totalCost}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
