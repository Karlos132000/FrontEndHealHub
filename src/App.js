import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import BookingPage from './BookingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import SpecialtiesPage from './SpecialtiesPage';
import HomePage from './HomePage'; // Import the new homepage component

import './App.css'; // Ensure you have an App.css file for styles

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    // Optionally navigate to home on logout
  };

  return (
      <Router>
        <div className="app-container">
          <nav className="top-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/booking">Book Now</Link></li> {/* Add this line */}
              {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
              {!isLoggedIn && <li><Link to="/register">Register</Link></li>}
              {isLoggedIn && <li><Link to="/profile">Profile</Link></li>}
              <li><Link to="/specialties">Specialties</Link></li>
              {isLoggedIn && <li><button onClick={handleLogout}>Logout</button></li>}
            </ul>
          </nav>
          <Routes>
            <Route path="/login" element={<LoginPage setLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate replace to="/login" />} />
            <Route path="/specialties" element={<SpecialtiesPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
