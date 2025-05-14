import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Components/assets/home.css'; // Ensure you have styling for better UI
import logo from "../Components/images/bit logo.png"; 
import { BASE_URL } from '../config';

const Home = ({ setRole }) => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    /* navigate("/login"); */
    window.location.href = `${BASE_URL}/oauth2/authorization/google`; 
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h2 className="welcome-text">Welcome Back!</h2>
        <img src={logo} alt="BIT Logo" className="home-logo" loading="lazy" />
        <h3 className="platform-title">PIC Services Platform</h3>
        <button type="button" onClick={handleGoogleSignIn} className="google-signin-btn">
          Google Sign In
        </button>

        <p className="bottom-text">Sign in with your BIT account</p>
      </div>
    </div>
  );
};

export default Home;