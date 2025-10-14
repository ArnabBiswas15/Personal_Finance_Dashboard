import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Transactions() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />
      <div className="flex-1 md:ml-64 flex flex-col">
        <Navbar onToggleSidebar={() => setOpen((s) => !s)} />
        <main className="p-4 flex-1 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600">Transaction CRUD UI will go here.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
