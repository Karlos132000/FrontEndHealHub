import React from 'react';
import '../styles/Footer.css'; // Make sure to create a Footer.css file

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <section className="footer-section">
                    <h4>HealHub</h4>
                    <ul>
                        <li><a href="#">Главная</a></li>
                        <li><a href="#about">О нас</a></li>
                        <li><a href="#help">Помощь</a></li>
                    </ul>
                </section>
                <section className="footer-section">
                    <h4>Свяжитесь с нами </h4>
                    <p>abadilutfi54@gmail.com</p>
                    <p>+7(991)-327-16-43</p>
                </section>
            </div>
        </footer>
    );
};

export default Footer;
