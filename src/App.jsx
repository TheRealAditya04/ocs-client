import { useState } from "react";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [role, setRole] = useState(null);

  function logout() {
    localStorage.removeItem("token");
    setRole(null);
  }

  if (!role) {
    return <Login onLogin={setRole} />;
  }

  return (
    <>
      {/* Logout button (global for all roles) */}
      <button
        onClick={logout}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "6px 12px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>

      {role === "student" && <StudentDashboard />}
      {role === "recruiter" && <RecruiterDashboard />}
      {role === "admin" && <AdminDashboard />}
    </>
  );
}
