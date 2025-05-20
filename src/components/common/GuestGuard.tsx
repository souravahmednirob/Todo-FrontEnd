import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface GuestGuardProps {
    children: React.ReactNode;
}

const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
    const { state } = useAuth();
    const location = useLocation();

    // Get the location the user was trying to access before being redirected to login
    const from = location.state?.from?.pathname || '/dashboard';

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

    // If authenticated, redirect to dashboard
    if (state.isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    // If not authenticated, render children
    return <>{children}</>;
};

export default GuestGuard;