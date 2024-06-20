import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './components/context/auth-context';
import BookingPage from './components/BookingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import HomePage from './components/HomePage';
import AboutUsPage from './components/AboutUsPage';
import AdminPage from './components/admin-manegment/AdminPage';
import UserPage from './components/admin-manegment/UserPage';
import ClinicPage from './components/admin-manegment/ClinicPage';
import AppointmentPage from './components/admin-manegment/AppointmentPage';
import DoctorPage from './components/admin-manegment/DoctorPage';
import SpecialtyPage from './components/admin-manegment/SpecialtyPage';
import ProtectedRoute from './components/ProtectedRoute';
import LogoutButton from './components/LogoutButton'; // Ensure LogoutButton is properly exported
// import logo from './images/HealHubLogoV2.png';
import './App.css';
import logo from './images/logo-no-background.png'; // Ensure the logo file name matches
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <section className="footer-section">
          <ul>
            <li><a href="#">Главная</a></li>
            <li><a href="#about">О нас</a></li>
            <li><a href="#help">Помощь</a></li>
          </ul>
        </section>
        <section className="footer-section">
          <h4>Свяжитесь с нами</h4>
          <p>abadilutfi54@gmail.com</p>
          <p>+7(991)-327-16-43</p>
        </section>
      </div>
    </footer>
  );
}


function App() {
  const { isLoggedIn, userRole, isLoading } = useAuth(); // Assuming you add an isLoading flag to your auth state

  if (isLoading) {
    return <div>Загрузка состояния аутентификации...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <nav className="top-nav">
          <Link to="/">
            <img src={logo} alt="HealHub Logo" className="app-logo" />
          </Link>
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/booking">Запись на прием</Link></li>
            {!isLoggedIn ? (
              <>
                <li><Link to="/login">Вход</Link></li>
                <li><Link to="/register">Регистрация</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/profile">Профиль</Link></li>
                <li><LogoutButton /></li>
              </>
            )}
            <li><Link to="/about">О нас</Link></li>
          </ul>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/users" element={<UserPage />} />
            <Route path="/admin/clinics" element={<ClinicPage />} />
            <Route path="/admin/appointments" element={<AppointmentPage />} />
            <Route path="/admin/doctors" element={<DoctorPage />} />
            <Route path="/admin/specialties" element={<SpecialtyPage />} />
            <Route path="/admin" element={<ProtectedRoute userRole={userRole}><AdminPage /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
