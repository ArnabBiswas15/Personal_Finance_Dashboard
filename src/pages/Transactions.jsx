import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

const Transactions = () => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "Food",
    type: "expense",
  });

  const [editingId, setEditingId] = useState(null);

  // Persist transactions
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // === CRUD Logic ===
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.amount) return;

    if (editingId) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...form, id: editingId, amount: +form.amount } : t
        )
      );
      setEditingId(null);
    } else {
      setTransactions((prev) => [
        ...prev,
        { ...form, id: Date.now(), amount: +form.amount },
      ]);
    }

    setForm({ date: "", amount: "", category: "Food", type: "expense" });
  };

  const handleEdit = (id) => {
    const txn = transactions.find((t) => t.id === id);
    if (txn) {
      setForm(txn);
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // === Pie Chart Data: Expense Breakdown by Category ===
  const expenseData = transactions.filter((t) => t.type === "expense");
  const categoryTotals = expenseData.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  // === Line Chart Data: Income vs Expense by Date ===
  const uniqueDates = [...new Set(transactions.map((t) => t.date))].sort();
  const groupedByDate = uniqueDates.map((d) => {
    const income = transactions
      .filter((t) => t.date === d && t.type === "income")
      .reduce((a, b) => a + b.amount, 0);
    const expense = transactions
      .filter((t) => t.date === d && t.type === "expense")
      .reduce((a, b) => a + b.amount, 0);
    return { date: d, income, expense };
  });

  // === Summary ===
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Transactions & Cash Flow</h1>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Total Income</p>
          <p className="text-green-600 text-xl font-bold">₹{totalIncome}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Total Expense</p>
          <p className="text-red-600 text-xl font-bold">₹{totalExpense}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Current Balance</p>
          <p
            className={`text-xl font-bold ${
              balance >= 0 ? "text-green-700" : "text-red-700"
            }`}
          >
            ₹{balance}
          </p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-4 flex flex-wrap gap-4"
      >
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border rounded p-2 w-40"
          required
        />
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="Amount"
          className="border rounded p-2 w-40"
          required
        />
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
          <option>Salary</option>
          <option>Other</option>
        </select>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border rounded p-2 w-40"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Transaction Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{t.date}</td>
                  <td className="p-2">₹{t.amount}</td>
                  <td className="p-2">{t.category}</td>
                  <td
                    className={`p-2 font-medium ${
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.type}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleEdit(t.id)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="5">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium mb-2 text-center">
            Monthly Expense Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={60}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-medium mb-2 text-center">
            Cash Flow Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={groupedByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#16A34A" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#DC2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
