// App.jsx
import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Investments from "./pages/Investments";
import Budget from "./pages/Budget";
import Settings from "./pages/Settings";

import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

// Create User Context
export const UserContext = createContext();

function AnimatedRoutes() {
  const location = useLocation();

  const pageTransition = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.4 },
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <motion.div {...pageTransition}>
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div {...pageTransition}>
              <Register />
            </motion.div>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition}>
                <Dashboard />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition}>
                <Transactions />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition}>
                <Investments />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute allowedRoles={["Admin", "User"]}>
              <motion.div {...pageTransition}>
                <Budget />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <motion.div {...pageTransition}>
                <Settings />
              </motion.div>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  // Load user from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      <Router>
        <Navbar />
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Sidebar />
          <div className="flex-1 p-4 overflow-auto">
            <AnimatedRoutes />
          </div>
        </div>
        <Footer />
      </Router>
    </UserContext.Provider>
  );
}
