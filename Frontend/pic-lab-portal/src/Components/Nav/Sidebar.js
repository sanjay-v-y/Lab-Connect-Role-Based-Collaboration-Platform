import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import '../assets/sidebar.css'; // Import sidebar styles

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate(); // ✅ Use navigate for redirection

  const handleLogout = () => {
    localStorage.removeItem("userType"); // ✅ Clear user data
    localStorage.removeItem("userId");
    navigate("/"); // ✅ Redirect to Home page
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
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/reports">Reports</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </>
        ) :(
          <>
            <li><Link to="/lab">Lab</Link></li>
            <li><Link to="/forum">Forum</Link></li>
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
