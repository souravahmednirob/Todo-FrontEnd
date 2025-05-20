import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Divider,
    Button,
    Grid,
    Chip,
    useTheme,
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    ExitToApp as LogoutIcon,
    TaskAlt as TaskAltIcon,
    CheckCircle as CheckCircleIcon,
    CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import { Status } from '../types';
import AppLayout from '../components/layout/AppLayout';
import AnimationWrapper from '../components/animations/AnimationWrapper';

const Profile: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { state, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppLayout>
            <AnimationWrapper animation="fadeIn">
                <Box sx={{ maxWidth: 800, mx: 'auto', pb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
                        My Profile
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <AnimationWrapper animation="fadeInUp" delay={0.2}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            bgcolor: 'primary.main',
                                            fontSize: 36,
                                            mb: 2,
                                        }}
                                    >
                                        {state.user?.mail.charAt(0).toUpperCase()}
                                    </Avatar>

                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        {state.user?.mail.split('@')[0]}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <EmailIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {state.user?.mail}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ width: '100%', my: 2 }} />

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<LogoutIcon />}
                                        onClick={handleLogout}
                                        fullWidth
                                    >
                                        Logout
                                    </Button>
                                </Paper>
                            </AnimationWrapper>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <AnimationWrapper animation="fadeInUp" delay={0.4}>
                                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <TaskAltIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="h6" fontWeight="bold">
                                            Task Overview
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ mb: 3 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={4}>
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    textAlign: 'center',
                                                    bgcolor: 'primary.light',
                                                    color: 'primary.contrastText',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Typography variant="h4" fontWeight="bold">
                                                    12
                                                </Typography>
                                                <Typography variant="body2">Total Tasks</Typography>
                                            </Paper>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    textAlign: 'center',
                                                    bgcolor: 'success.light',
                                                    color: 'success.contrastText',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Typography variant="h4" fontWeight="bold">
                                                    5
                                                </Typography>
                                                <Typography variant="body2">Completed</Typography>
                                            </Paper>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    textAlign: 'center',
                                                    bgcolor: 'warning.light',
                                                    color: 'warning.contrastText',
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Typography variant="h4" fontWeight="bold">
                                                    7
                                                </Typography>
                                                <Typography variant="body2">Pending</Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </AnimationWrapper>

                            <AnimationWrapper animation="fadeInUp" delay={0.6}>
                                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="h6" fontWeight="bold">
                                            Activity Timeline
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ mb: 3 }} />

                                    <Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                mb: 3,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    mr: 2,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        bgcolor: 'success.main',
                                                    }}
                                                >
                                                    <CheckCircleIcon />
                                                </Avatar>
                                                <Box
                                                    sx={{
                                                        width: 2,
                                                        height: 40,
                                                        bgcolor: 'divider',
                                                        my: 0.5,
                                                    }}
                                                />
                                            </Box>

                                            <Box>
                                                <Typography variant="body1" fontWeight="medium">
                                                    Completed a task
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                                    Today, 10:30 AM
                                                </Typography>
                                                <Paper
                                                    variant="outlined"
                                                    sx={{
                                                        p: 1.5,
                                                        mt: 1,
                                                        borderRadius: 2,
                                                        bgcolor: 'success.lighter',
                                                        borderColor: 'success.light',
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        Prepare presentation for the meeting
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                mb: 3,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    mr: 2,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        bgcolor: 'primary.main',
                                                    }}
                                                >
                                                    <TaskAltIcon />
                                                </Avatar>
                                                <Box
                                                    sx={{
                                                        width: 2,
                                                        height: 40,
                                                        bgcolor: 'divider',
                                                        my: 0.5,
                                                    }}
                                                />
                                            </Box>

                                            <Box>
                                                <Typography variant="body1" fontWeight="medium">
                                                    Created a new task
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                                    Yesterday, 2:15 PM
                                                </Typography>
                                                <Paper
                                                    variant="outlined"
                                                    sx={{
                                                        p: 1.5,
                                                        mt: 1,
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        Research new design trends for the website
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    mr: 2,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        bgcolor: 'primary.main',
                                                    }}
                                                >
                                                    <PersonIcon />
                                                </Avatar>
                                            </Box>

                                            <Box>
                                                <Typography variant="body1" fontWeight="medium">
                                                    Joined Todo App
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    May 15, 2023
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>
                            </AnimationWrapper>
                        </Grid>
                    </Grid>
                </Box>
            </AnimationWrapper>
        </AppLayout>
    );
};

export default Profile;