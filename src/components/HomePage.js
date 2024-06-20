import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import medicalProfessionalsImage from '../images/teamMED.png'; // Ensure this path is correct

const HomePage = () => {
    let navigate = useNavigate();

    const handleBookNowClick = () => {
        if (window.ym) {
            window.ym(97430458, 'reachGoal', 'MainButtonVisit');
        }
        navigate('/booking');
    };

    return (
        <div className="home-page-container">
            <header className="home-header">
                <nav className="navigation">
                    {/* Placeholder for Navigation Links */}
                </nav>
            </header>
            <main className="main-content">
                <img src={medicalProfessionalsImage} alt="Healthcare professionals" className="landing-image" />
                <div className="headline-container">
                    <h1>Добро пожаловать в HealHub</h1>
                    <p className="headline-subtext">
                        В HealHub мы считаем, что доступ к качественному медицинскому обслуживанию должен быть простым и удобным. Попрощайтесь с долгим ожиданием и бесконечными телефонными звонками - наша онлайн-платформа позволит вам взять под контроль свое здоровье всего несколькими щелчками мыши.
                    </p>
                    <p className="booking-description">
                        Готовы записаться на прием? Нажмите ниже, чтобы выбрать удобное для вас время и врача.
                    </p>
                    <button onClick={handleBookNowClick} className="get-started-btn">Запись на прием сейчас </button>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
