import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Link,
    Alert,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Assignment as AssignmentIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../store/AuthContext';
import authService from '../services/authService';
import { motion } from 'framer-motion';
import AnimationWrapper from '../components/animations/AnimationWrapper';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            mail: '',
            password: '',
        },
        validationSchema: Yup.object({
            mail: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .required('Password is required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setError(null);
                const response = await authService.login(values);

                if (response.success && response.data) {
                    login(response.data);
                    navigate('/dashboard');
                } else {
                    setError(response.message || 'Login failed');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Login failed. Please try again.');
                console.error('Login error:', err);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Container component="main" maxWidth="xs">
            <AnimationWrapper animation="fadeInUp">
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Paper
                        elevation={6}
                        sx={{
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: 3,
                            width: '100%',
                        }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 10, 0] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Box
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    width: 64,
                                    height: 64,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                }}
                            >
                                <AssignmentIcon fontSize="large" />
                            </Box>
                        </motion.div>

                        <Typography component="h1" variant="h4" fontWeight="bold" mb={1}>
                            Welcome Back
                        </Typography>
                        <Typography color="text.secondary" mb={3}>
                            Log in to continue to your account
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="mail"
                                name="mail"
                                label="Email Address"
                                autoComplete="email"
                                autoFocus
                                value={formik.values.mail}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.mail && Boolean(formik.errors.mail)}
                                helperText={formik.touched.mail && formik.errors.mail}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 3 }}
                            />

                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={formik.isSubmitting}
                                    sx={{
                                        py: 1.5,
                                        mb: 2,
                                        borderRadius: 2,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {formik.isSubmitting ? 'Logging in...' : 'Sign In'}
                                </Button>
                            </motion.div>

                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Typography variant="body2">
                                    Don't have an account?{' '}
                                    <Link component={RouterLink} to="/register" variant="body2" fontWeight="bold">
                                        Sign Up
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </AnimationWrapper>
        </Container>
    );
};

export default Login;