import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Components/assets/home.css'; // Ensure you have styling for better UI

const Home = ({ setRole }) => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="home-card"> {/* Added specificity */}
        <h1 className="home-title">Welcome to PIC Portal</h1>
        <p className="home-description">Register and manage labs with ease.</p>
        <button type="button" onClick={handleGoogleSignIn} className="google-signin-btn">
          Sign in with Google
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="home-nav"> {/* Added class for better targeting */}
        <Link to="/admin" className="home-link">Go to Admin</Link> <br />
        <Link to="/labs" className="home-link">Go to Labs</Link> <br />
        <Link to="/user" className="home-link">Go to User</Link>
      </nav>
    </div>
  );
};

export default Home;