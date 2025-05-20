import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { state } = useAuth();
    const location = useLocation();

    // While auth state is loading, show a loading indicator
    if (state.loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // If not authenticated, redirect to login
    if (!state.isAuthenticated) {
        // Store the location the user was trying to access
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated, render children
    return <>{children}</>;
};

export default AuthGuard;