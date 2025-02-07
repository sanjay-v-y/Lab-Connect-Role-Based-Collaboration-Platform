import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const Home = () => {
  return (
    <div>
      <h1>Welcome to PIC Portal</h1>
      <p>Register and manage labs with ease.</p>
      
      {/* Navigation Links */}
      <nav>
        <Link to="/admin">Go to Admin</Link> <br />
        <Link to="/labs">Go to Labs</Link> <br />
        <Link to="/user">Go to User</Link>
      </nav>
    </div>
  );
};

export default Home;
