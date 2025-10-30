import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function InvestmentsModule() {
  const [investments, setInvestments] = useState(() => {
    const saved = localStorage.getItem("investments");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({ name: "", type: "Stock", amount: "", price: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [prices, setPrices] = useState({});
  const [roiData, setRoiData] = useState([]);

  useEffect(() => {
    localStorage.setItem("investments", JSON.stringify(investments));
    generateRoiTrend();
  }, [investments]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addInvestment = () => {
    if (!form.name || !form.amount || !form.price) return;
    const newInv = { ...form, amount: +form.amount, price: +form.price };
    if (editingIndex !== null) {
      const updated = [...investments];
      updated[editingIndex] = newInv;
      setInvestments(updated);
      setEditingIndex(null);
    } else {
      setInvestments([...investments, newInv]);
    }
    setForm({ name: "", type: "Stock", amount: "", price: "" });
  };

  const deleteInvestment = (i) => setInvestments(investments.filter((_, idx) => idx !== i));

  const editInvestment = (i) => {
    setForm(investments[i]);
    setEditingIndex(i);
  };

  const totalInvested = investments.reduce((sum, i) => sum + i.amount * i.price, 0);

  const fetchPrices = async () => {
    const key = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
    if (!key) return alert("Add your VITE_ALPHA_VANTAGE_KEY in .env");

    for (let inv of investments) {
      try {
        const res = await axios.get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${inv.name}&apikey=${key}`
        );
        const price = parseFloat(res.data["Global Quote"]["05. price"]);
        if (!isNaN(price)) setPrices((p) => ({ ...p, [inv.name]: price }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const totalValue = investments.reduce((sum, i) => {
    const live = prices[i.name] || i.price;
    return sum + i.amount * live;
  }, 0);

  const gainLoss = totalValue - totalInvested;
  const roi = ((gainLoss / totalInvested) * 100).toFixed(2);

  const typeAllocation = investments.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.amount * (prices[inv.name] || inv.price);
    return acc;
  }, {});

  const allocationData = Object.entries(typeAllocation).map(([name, value]) => ({ name, value }));

  const generateRoiTrend = () => {
    const trend = Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      roi: (Math.random() * 10 - 5).toFixed(2),
    }));
    setRoiData(trend);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Investments Module</h1>

      {/* Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4">
        <input
          className="border p-2 rounded flex-1"
          name="name"
          placeholder="Name (e.g. AAPL)"
          value={form.name}
          onChange={handleChange}
        />
        <select className="border p-2 rounded" name="type" value={form.type} onChange={handleChange}>
          <option>Stock</option>
          <option>Mutual Fund</option>
          <option>Crypto</option>
        </select>
        <input
          className="border p-2 rounded w-24"
          name="amount"
          type="number"
          placeholder="Units"
          value={form.amount}
          onChange={handleChange}
        />
        <input
          className="border p-2 rounded w-24"
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addInvestment}
        >
          {editingIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>Name</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Price</th>
              <th>Current Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv, i) => (
              <tr key={i} className="text-center border-t">
                <td>{inv.name}</td>
                <td>{inv.type}</td>
                <td>{inv.amount}</td>
                <td>{inv.price}</td>
                <td>{((prices[inv.name] || inv.price) * inv.amount).toFixed(2)}</td>
                <td>
                  <button className="text-blue-500 mr-2" onClick={() => editInvestment(i)}>
                    Edit
                  </button>
                  <button className="text-red-500" onClick={() => deleteInvestment(i)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-around mb-6">
        <div>Total Invested: ₹{totalInvested.toFixed(2)}</div>
        <div>Total Value: ₹{totalValue.toFixed(2)}</div>
        <div>Gain/Loss: ₹{gainLoss.toFixed(2)}</div>
        <div>ROI: {roi}%</div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-2">Allocation</h2>
          <PieChart width={250} height={250}>
            <Pie data={allocationData} dataKey="value" nameKey="name" outerRadius={100}>
              {allocationData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-2">Top Holdings</h2>
          <BarChart width={300} height={250} data={investments}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-2">ROI Trend</h2>
          <LineChart width={300} height={250} data={roiData}>
            <XAxis dataKey="day" />
            <YAxis />
            <CartesianGrid stroke="#eee" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="roi" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={fetchPrices}
        >
          Refresh Live Prices
        </button>
      </div>
    </div>
  );
}
