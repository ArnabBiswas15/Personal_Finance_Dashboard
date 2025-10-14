import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiDollarSign, FiPieChart, FiSettings, FiTrendingUp } from "react-icons/fi";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
  { name: "Transactions", path: "/transactions", icon: <FiDollarSign /> },
  { name: "Investments", path: "/investments", icon: <FiTrendingUp /> },
  { name: "Budget", path: "/budget", icon: <FiPieChart /> },
  { name: "Settings", path: "/settings", icon: <FiSettings /> },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <aside className="w-64 bg-gray-100 p-6 hidden md:block h-screen">
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition hover:bg-indigo-100 ${
              location.pathname === link.path ? "bg-indigo-200 font-semibold" : ""
            }`}
          >
            {link.icon} {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
