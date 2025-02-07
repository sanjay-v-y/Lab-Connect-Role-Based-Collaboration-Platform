import React from "react";
import { Outlet } from "react-router-dom"; // Outlet for nested routes
import Sidebar from "./Nav/Sidebar.js";
import { useLocation } from "react-router-dom"; // To check current route

import './assets/layout.css';

const Layout = () => {
    const location = useLocation();
    
    // Hide sidebar on the home page
    const showSidebar = location.pathname !== "/";

    return (
      <div className="layout">
        {showSidebar && <Sidebar />}
        <div className="content">
          <Outlet /> {/* This is where Admin, Labs, User pages will render */}
        </div>
      </div>
    );
};

export default Layout;