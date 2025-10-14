import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const investmentData = [
  { month: "Jan", value: 2000 },
  { month: "Feb", value: 2500 },
  { month: "Mar", value: 3000 },
  { month: "Apr", value: 2800 },
  { month: "May", value: 3500 },
];

export default function Dashboard() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold mb-2">Net Worth</h3>
          <p className="text-2xl font-bold">$25,600</p>
          <span className="text-green-500">+12% this month</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
          <ul className="space-y-1 text-gray-600">
            <li>Payment to John $120</li>
            <li>Salary $3000</li>
            <li>Investment $500</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold mb-2">Investments</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={investmentData}>
              <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
