import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Nav/Sidebar.js";
import "../Components/assets/layout.css";

// ✅ Fetch user role from localStorage inside Layout itself
const Layout = () => {

  const userRole = localStorage.getItem("userType") // ✅ Directly get the userType value
  // Default to admin if no user found

  const showSidebar = userRole === "admin" || userRole === "student"; // Show sidebar for admin/student

  return (
    <div className="layout">
      {showSidebar && <Sidebar userRole={userRole} />} {/* ✅ Pass correct role */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
