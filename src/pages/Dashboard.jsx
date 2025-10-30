import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import AnalyticsWidgets from "../components/AnalyticsWidgets";
import { saveDashboardData, loadDashboardData } from "../utils/persistence";

const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  // Theme state (light/dark)
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  // Dashboard data
  const [investments, setInvestments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savingsTrend, setSavingsTrend] = useState([]);

  // Load data (persisted or sample)
  useEffect(() => {
    const saved = loadDashboardData();
    if (saved) {
      setInvestments(saved.investments || []);
      setExpenses(saved.expenses || []);
      setSavingsTrend(saved.savingsTrend || []);
    } else {
      const sampleInv = [
        { name: "AAPL", roi: 12.3, invested: 50000, current: 56150 },
        { name: "VTI", roi: 8.5, invested: 80000, current: 86800 },
        { name: "BTC", roi: 22.1, invested: 30000, current: 36630 },
      ];
      const sampleExp = [
        { name: "Rent", value: 12000 },
        { name: "Groceries", value: 8000 },
        { name: "Transport", value: 2500 },
        { name: "Dining", value: 4000 },
        { name: "Subscriptions", value: 1500 },
      ];
      const sampleSavings = [
        { month: "Jan", value: 8000 },
        { month: "Feb", value: 8500 },
        { month: "Mar", value: 12000 },
        { month: "Apr", value: 10000 },
        { month: "May", value: 13000 },
        { month: "Jun", value: 14000 },
      ];
      setInvestments(sampleInv);
      setExpenses(sampleExp);
      setSavingsTrend(sampleSavings);
      saveDashboardData({
        investments: sampleInv,
        expenses: sampleExp,
        savingsTrend: sampleSavings,
      });
    }
  }, []);

  // Save data when changed
  useEffect(() => {
    if (investments.length || expenses.length || savingsTrend.length) {
      saveDashboardData({ investments, expenses, savingsTrend });
    }
  }, [investments, expenses, savingsTrend]);

  // Theme handling
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Derived calculations
  const totalInvested = investments.reduce((s, i) => s + (i.invested || 0), 0);
  const totalCurrent = investments.reduce((s, i) => s + (i.current || 0), 0);
  const gainLoss = totalCurrent - totalInvested;
  const roiOverall = totalInvested
    ? ((gainLoss / totalInvested) * 100).toFixed(2)
    : "0.00";

  const top3Expenses = [...expenses]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  const roiInvestments = [...investments]
    .sort((a, b) => (b.roi || 0) - (a.roi || 0))
    .slice(0, 5);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className={`p-6 min-h-screen transition-colors duration-300 ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Overview of your finances
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm">Total Value</div>
              <div className="font-semibold text-lg">
                ₹{Number(totalCurrent).toLocaleString()}
              </div>
              <div
                className={`text-sm ${
                  gainLoss >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                ROI: {roiOverall}%
              </div>
            </div>

            <button
              onClick={() => setDarkMode((v) => !v)}
              className="px-3 py-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        {/* Analytics Widgets */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.08 }}
        >
          <AnalyticsWidgets
            netWorth={`₹${Number(totalCurrent).toLocaleString()}`}
            investmentsCount={investments.length}
            monthlySavings={Number(
              savingsTrend[savingsTrend.length - 1]?.value || 0
            )}
          />
        </motion.div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Expenses */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-3">
              Top 3 Expense Categories
            </h3>
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={top3Expenses}
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {top3Expenses.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {top3Expenses.map((e, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{e.name}</span>
                  <span className="font-medium">
                    ₹{e.value.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Monthly Savings Trend */}
          <motion.div
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-3">Monthly Savings Trend</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={savingsTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Highest ROI Investments */}
          <motion.div
            className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-3">
              Highest ROI Investments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roiInvestments.map((inv, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border dark:border-gray-700 flex justify-between items-center"
                >
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {inv.name}
                    </div>
                    <div className="text-xl font-semibold">
                      ₹{Number(inv.current || inv.invested).toLocaleString()}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      inv.roi >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {inv.roi?.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
