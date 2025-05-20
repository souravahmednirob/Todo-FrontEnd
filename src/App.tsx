// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
// Remove the direct import from @mui/x-date-pickers
// import { LocalizationProvider } from '@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Theme
import theme from './theme';

// Context
import { AuthProvider } from './store/AuthContext';

// Guards
import AuthGuard from './components/common/AuthGuard';
import GuestGuard from './components/common/GuestGuard';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import NewTask from './pages/NewTask';
import EditTask from './pages/EditTask';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Temporarily remove LocalizationProvider until you install the dependencies */}
            {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Auth routes (accessible only when not logged in) */}
                        <Route
                            path="/login"
                            element={
                                <GuestGuard>
                                    <Login />
                                </GuestGuard>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <GuestGuard>
                                    <Register />
                                </GuestGuard>
                            }
                        />

                        {/* App routes (accessible only when logged in) */}
                        <Route
                            path="/dashboard"
                            element={
                                <AuthGuard>
                                    <Dashboard />
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/tasks"
                            element={
                                <AuthGuard>
                                    <Tasks />
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/tasks/new"
                            element={
                                <AuthGuard>
                                    <NewTask />
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/tasks/:id"
                            element={
                                <AuthGuard>
                                    <TaskDetail />
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/tasks/:id/edit"
                            element={
                                <AuthGuard>
                                    <EditTask />
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/calendar"
                            element={
                                <AuthGuard>
                                    <Calendar />
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <AuthGuard>
                                    <Profile />
                                </AuthGuard>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <AuthGuard>
                                    <Settings />
                                </AuthGuard>
                            }
                        />

                        {/* Redirect root to dashboard if logged in, otherwise to login */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />

                        {/* Catch-all route redirects to dashboard */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </Router>
            </AuthProvider>

            {/* Toast notification container */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {/* </LocalizationProvider> */}
        </ThemeProvider>
    );
};

export default App;