// src/components/AnalyticsWidgets.jsx
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, PiggyBank, Wallet } from "lucide-react";

const widgets = [
  { icon: <Wallet className="w-6 h-6" />, label: "Net Worth", key: "netWorth" },
  { icon: <TrendingUp className="w-6 h-6" />, label: "Investments", key: "investmentsCount" },
  { icon: <PiggyBank className="w-6 h-6" />, label: "Monthly Savings", key: "monthlySavings" },
];

export default function AnalyticsWidgets({ netWorth, investmentsCount, monthlySavings }) {
  const values = { netWorth, investmentsCount, monthlySavings };

  return (
    <>
      {widgets.map((w, i) => (
        <motion.div
          key={w.key}
          className="p-5 rounded-2xl bg-white dark:bg-gray-800 shadow hover:shadow-lg transition"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700">
              {w.icon}
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-300">{w.label}</div>
              <div className="text-xl font-semibold">
                {w.key === "monthlySavings" ? `₹${values[w.key].toLocaleString()}` : values[w.key]}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
}
