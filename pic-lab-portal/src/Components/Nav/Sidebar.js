import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { BASE_URL } from "../../config.js";
import '../assets/sidebar.css'; 

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate(); 

  const handleLogout = async() => {
    try {
      await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      
      localStorage.removeItem("userType");
      localStorage.removeItem("userId");

      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="sidebar">
      <h2>PIC Portal</h2>
      <ul>
        <li><Link to={`/${userRole}`}>Dashboard</Link></li>
        {userRole === "admin" ? (
          <>
            <li><Link to="/labs">Manage Labs</Link></li>
            <li><Link to="/user">Manage Users</Link></li>
            <li><Link to="/events" className="sidebar-link">Events</Link></li>
            <li><Link to="/discussForum">Discussion Forum</Link></li>
          </>
        ) : userRole === "faculty" ? (
          <>
            <li><Link to="/viewStudents">View Students</Link></li>
            <li><Link to="/requests">Requests</Link></li>
            <li><Link to="/attendance">Attendance</Link></li>
            <li><Link to="/discussForum">Discussion Forum</Link></li>
          </>
        ):userRole === "student" ? (
          <>
            <li><Link to="/studentLabDetails">Lab</Link></li>
            <li><Link to="/discussForum">Discuss Forum</Link></li>
          </>
        ) :(
          <>
            <li><Link to="/discussForum">Discuss Forum</Link></li>
          </>
        )}
      </ul>

      <button type="button" className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
