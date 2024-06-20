import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/auth-context'; // Ensure the path matches your project structure

function LogoutButton() {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Using logout from AuthContext

    const handleLogout = () => {
        logout(); // This will clear the token and update isLoggedIn state
        navigate('/'); // Navigate to home on logout
    };

    return (
        <button onClick={handleLogout}>Выход</button>
    );
}

export default LogoutButton;
