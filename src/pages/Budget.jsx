// src/pages/Budget.jsx
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6", "#0EA5E9"];

const Budget = () => {
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({ category: "Food", amount: "" });

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const exists = budgets.find((b) => b.category === form.category);
    if (exists) {
      setBudgets(
        budgets.map((b) =>
          b.category === form.category ? { ...b, amount: +form.amount } : b
        )
      );
    } else {
      setBudgets([...budgets, { ...form, amount: +form.amount }]);
    }
    setForm({ category: "Food", amount: "" });
  };

  const handleDelete = (cat) => {
    setBudgets(budgets.filter((b) => b.category !== cat));
  };

  // 🥧 Prepare data for Pie chart (Expense breakdown)
  const expenseByCategory = budgets.map((b) => {
    const spent = transactions
      .filter((t) => t.category === b.category && t.type === "expense")
      .reduce((a, t) => a + t.amount, 0);
    return { name: b.category, value: spent };
  }).filter((item) => item.value > 0);

  // 📈 Prepare data for Line chart (Cash flow trends)
  const monthlyTrends = [];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  months.forEach((m, i) => {
    const monthTxns = transactions.filter(
      (t) => new Date(t.date).getMonth() === i
    );
    const income = monthTxns
      .filter((t) => t.type === "income")
      .reduce((a, t) => a + t.amount, 0);
    const expense = monthTxns
      .filter((t) => t.type === "expense")
      .reduce((a, t) => a + t.amount, 0);
    if (income > 0 || expense > 0)
      monthlyTrends.push({ month: m, income, expense });
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Budget Tracking</h1>

      {/* Set Budget Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-4 flex flex-wrap gap-4"
      >
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border rounded p-2 w-40"
        >
          <option>Food</option>
          <option>Rent</option>
          <option>Entertainment</option>
          <option>Shopping</option>
          <option>Investment</option>
          <option>Other</option>
        </select>
        <input
          type="number"
          placeholder="Budget Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border rounded p-2 w-40"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Set Budget
        </button>
      </form>

      {/* Budget Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((b) => {
          const spent = transactions
            .filter((t) => t.category === b.category && t.type === "expense")
            .reduce((a, t) => a + t.amount, 0);
          const remaining = b.amount - spent;
          const percent = Math.min((spent / b.amount) * 100, 100);

          return (
            <div key={b.category} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">{b.category}</h3>
                <button
                  onClick={() => handleDelete(b.category)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
              <div className="h-3 bg-gray-200 rounded-full">
                <div
                  className={`h-3 rounded-full ${
                    percent < 70
                      ? "bg-green-500"
                      : percent < 100
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <p className="text-sm mt-2">
                Spent: ₹{spent} / ₹{b.amount}{" "}
                ({remaining >= 0
                  ? `Remaining ₹${remaining}`
                  : `Over by ₹${-remaining}`})
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Pie / Donut Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Monthly Expense Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                label
              >
                {expenseByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Cash Flow Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#22C55E" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Budget;
