import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({ isLoggedIn: false, userRole: null, isLoading: true });

    const logout = () => {
        console.log("Logging out, clearing the token and resetting auth state");
        localStorage.removeItem('token');
        setAuth({ isLoggedIn: false, userRole: null, isLoading: false });
    };

    const setLoggedIn = (loggedIn, token) => {
        if (loggedIn) {
            const decoded = jwtDecode(token);
            console.log(`Setting logged in status to: ${loggedIn} with role: ${decoded.role}`);
            setAuth({ isLoggedIn: true, userRole: decoded.role, isLoading: false });
        } else {
            console.log("Setting logged out status.");
            logout();
        }
    };

    useEffect(() => {
        console.log("Checking token on load...");
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log(`JWT decoded, found role: ${decoded.role}`);
                setAuth({ isLoggedIn: true, userRole: decoded.role, isLoading: false });
            } catch (error) {
                console.error('Error decoding token on initial load:', error);
                logout();
            }
        } else {
            setAuth(auth => ({ ...auth, isLoading: false })); // Ensure to update isLoading even if no token
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...auth, logout, setLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}
