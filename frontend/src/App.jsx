import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Placements from "./pages/Placements";
import Notes from "./pages/Notes";
import News from "./pages/News";

// Admin pages
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import AddPlacement from "./admin/AddPlacement";
import EditPlacement from "./admin/EditPlacement";
import PlacementList from "./admin/PlacementList";
import AddNotes from "./admin/AddNotes";
import AddNews from "./admin/AddNews";

// Toast container component for beautiful custom notifications
export const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/admin" replace />;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          <Routes>
            {/* Student Pages */}
            <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/placements" element={<Placements darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/notes" element={<Notes darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/news" element={<News darkMode={darkMode} setDarkMode={setDarkMode} />} />

            {/* Admin Pages */}
            <Route path="/admin" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-placement"
              element={
                <ProtectedRoute>
                  <AddPlacement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-placement/:id"
              element={
                <ProtectedRoute>
                  <EditPlacement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/placements-admin"
              element={
                <ProtectedRoute>
                  <PlacementList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-notes"
              element={
                <ProtectedRoute>
                  <AddNotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-news"
              element={
                <ProtectedRoute>
                  <AddNews />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Global Toast Stack */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 transform transition-all duration-300 translate-y-0 scale-100 ${
                toast.type === "error"
                  ? "bg-rose-600 dark:bg-rose-500"
                  : toast.type === "warning"
                  ? "bg-amber-500"
                  : "bg-emerald-600 dark:bg-emerald-500"
              }`}
            >
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      </BrowserRouter>
    </ToastContext.Provider>
  );
}