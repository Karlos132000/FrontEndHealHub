import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/auth-context';
import '../styles/LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setLoggedIn } = useAuth();

    window.ym(97430458, 'reachGoal', 'login');


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3360/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.accessToken);
                setLoggedIn(true, data.accessToken);
                navigate('/');
            } else {
                console.error('Login failed with status: ', response.status);
                alert('Вход не выполнен. Пожалуйста, проверьте свои учетные данные и повторите попытку.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Вход не выполнен из-за сетевой ошибки.');
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Вход в систему</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <label>Email:</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <label>Пароль:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit">Вход</button>
            </form>
        </div>
    );
};

export default LoginPage;
