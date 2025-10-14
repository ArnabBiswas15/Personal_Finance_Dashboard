import React, { useContext } from "react";
import { UserContext } from "../App";
import { FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);

  return (
    <nav className="bg-white shadow sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <div className="font-bold text-xl text-gray-800">Finance Dashboard</div>
      {user && (
        <div className="flex items-center gap-4">
          <img src="/avatar.png" alt="profile" className="w-10 h-10 rounded-full border-2 border-indigo-500" />
          <span className="text-gray-700 font-medium">{user.email} ({user.role})</span>
          <button onClick={logout} className="bg-red-600 px-3 py-1 rounded-lg text-white flex items-center gap-1 hover:bg-red-700 transition">
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
