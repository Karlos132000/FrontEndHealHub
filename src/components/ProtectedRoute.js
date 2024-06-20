import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/auth-context';

function ProtectedRoute({ children }) {
    const { isLoggedIn, userRole } = useAuth();

    console.log(`Accessing Protected Route, User Role: ${userRole}`);
    if (!isLoggedIn || userRole !== 'ADMIN') {
        console.log(`Unauthorized access to admin route, redirecting to home`);
        return <Navigate to="/" replace />;
    }
    return children;
}

export default ProtectedRoute;
