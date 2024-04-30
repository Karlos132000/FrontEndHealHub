import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; // Ensure you import the CSS file correctly

const LoginPage = ({ setLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3360/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('userId', data.userId); // Assuming 'userId' is part of the response
                setLoggedIn(true);
                navigate('/');
            } else {
                alert('Login failed. Please check your credentials and try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed due to a network error.');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Вход</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Вход </button>
            </form>
        </div>
    );
};

export default LoginPage;
