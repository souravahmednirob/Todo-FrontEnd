// src/pages/Register.tsx
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

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            mail: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            mail: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Confirm password is required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setError(null);
                const { mail, password } = values;
                const response = await authService.register({ mail, password });

                if (response.success && response.data) {
                    login(response.data);
                    navigate('/dashboard');
                } else {
                    setError(response.message || 'Registration failed');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
                console.error('Registration error:', err);
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
                            animate={{ scale: [0.8, 1.1, 1] }}
                            transition={{ duration: 0.5 }}
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
                            Create Account
                        </Typography>
                        <Typography color="text.secondary" mb={3}>
                            Sign up to get started with Todo App
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
                                autoComplete="new-password"
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
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
                                    {formik.isSubmitting ? 'Creating Account...' : 'Sign Up'}
                                </Button>
                            </motion.div>

                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Typography variant="body2">
                                    Already have an account?{' '}
                                    <Link component={RouterLink} to="/login" variant="body2" fontWeight="bold">
                                        Sign In
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

export default Register;