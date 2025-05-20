import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '../types';
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string; // Subject (usually the user email)
    exp: number; // Expiration time
}

// Define the initial auth state
const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    loading: true,
    error: null,
    user: null,
};

// Define action types
type AuthAction =
    | { type: 'LOGIN_SUCCESS'; payload: string }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'SET_USER'; payload: User }
    | { type: 'AUTH_ERROR'; payload: string };

// Create the reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                token: action.payload,
                loading: false,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                isAuthenticated: false,
                token: null,
                loading: false,
                error: action.payload,
                user: null,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                token: null,
                loading: false,
                user: null,
            };
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'AUTH_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

// Create the context
interface AuthContextType {
    state: AuthState;
    login: (token: string) => void;
    logout: () => void;
    setUser: (user: User) => void;
    setError: (error: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for token on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the token to check if it's expired
                const decoded = jwtDecode<JwtPayload>(token);
                const isExpired = decoded.exp * 1000 < Date.now();

                if (isExpired) {
                    localStorage.removeItem('token');
                    dispatch({ type: 'LOGOUT' });
                } else {
                    dispatch({ type: 'LOGIN_SUCCESS', payload: token });
                    // Create a basic user object from token
                    const user: User = {
                        id: 0, // We don't have this from the token
                        mail: decoded.sub
                    };
                    dispatch({ type: 'SET_USER', payload: user });
                }
            } catch (error) {
                localStorage.removeItem('token');
                dispatch({ type: 'LOGOUT' });
            }
        } else {
            dispatch({ type: 'LOGOUT' });
        }
    }, []);

    // Login action
    const login = (token: string) => {
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: token });

        try {
            // Decode the token to extract user information
            const decoded = jwtDecode<JwtPayload>(token);
            const user: User = {
                id: 0, // We don't have this from token
                mail: decoded.sub
            };
            dispatch({ type: 'SET_USER', payload: user });
        } catch (error) {
            console.error('Failed to decode token:', error);
        }
    };

    // Logout action
    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    // Set user action
    const setUser = (user: User) => {
        dispatch({ type: 'SET_USER', payload: user });
    };

    // Set error action
    const setError = (error: string) => {
        dispatch({ type: 'AUTH_ERROR', payload: error });
    };

    // Create the context value
    const value = {
        state,
        login,
        logout,
        setUser,
        setError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};