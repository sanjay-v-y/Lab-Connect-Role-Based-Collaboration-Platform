import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/sidebar.css'; // Import sidebar styles

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>PIC Portal</h2>
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/labs">Manage Labs</Link></li>
        <li><Link to="/manage-users">Manage Users</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/forum">Forum</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
