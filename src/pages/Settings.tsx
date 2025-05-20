import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Switch,
    FormControlLabel,
    Button,
    Divider,
    TextField,
    Grid,
    Alert,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Tabs,
    Tab,
    useTheme,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Palette as PaletteIcon,
    Lock as LockIcon,
    Save as SaveIcon,
    ColorLens as ColorLensIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AppLayout from '../components/layout/AppLayout';
import AnimationWrapper from '../components/animations/AnimationWrapper';

const Settings: React.FC = () => {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Notifications settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [reminderNotifications, setReminderNotifications] = useState(true);

    // Appearance settings
    const [darkMode, setDarkMode] = useState(false);
    const [compactMode, setCompactMode] = useState(false);
    const [themeColor, setThemeColor] = useState('blue');

    // Password change form
    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string().required('Current password is required'),
            newPassword: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('New password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
                .required('Please confirm your password'),
        }),
        onSubmit: (values, { resetForm }) => {
            // Here you would typically call an API to change the password
            console.log('Password change submitted:', values);

            // Show success message
            setSaveSuccess(true);

            // Reset form
            resetForm();

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        },
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const saveSettings = () => {
        // Here you would typically save the settings to an API
        console.log('Settings saved:', {
            notifications: {
                email: emailNotifications,
                push: pushNotifications,
                reminder: reminderNotifications,
            },
            appearance: {
                darkMode,
                compactMode,
                themeColor,
            },
        });

        // Show success message
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
            setSaveSuccess(false);
        }, 3000);
    };

    return (
        <AppLayout>
            <AnimationWrapper animation="fadeIn">
                <Box sx={{ maxWidth: 800, mx: 'auto', pb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
                        Settings
                    </Typography>

                    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                sx={{
                                    '& .MuiTab-root': {
                                        minHeight: 64,
                                    },
                                }}
                            >
                                <Tab
                                    icon={<NotificationsIcon />}
                                    label="Notifications"
                                    iconPosition="start"
                                />
                                <Tab
                                    icon={<PaletteIcon />}
                                    label="Appearance"
                                    iconPosition="start"
                                />
                                <Tab
                                    icon={<LockIcon />}
                                    label="Security"
                                    iconPosition="start"
                                />
                            </Tabs>
                        </Box>

                        {/* Success alert */}
                        {saveSuccess && (
                            <Alert
                                severity="success"
                                sx={{ mx: 3, mt: 3 }}
                            >
                                Settings saved successfully!
                            </Alert>
                        )}

                        {/* Notifications Tab */}
                        {tabValue === 0 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Notification Preferences
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Configure how you want to be notified about your tasks and updates.
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={emailNotifications}
                                                    onChange={(e) => setEmailNotifications(e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label="Email Notifications"
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                                            Receive task reminders and updates via email
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={pushNotifications}
                                                    onChange={(e) => setPushNotifications(e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label="Push Notifications"
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                                            Receive notifications in your browser
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={reminderNotifications}
                                                    onChange={(e) => setReminderNotifications(e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label="Task Reminders"
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                                            Get reminded before task due dates
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            onClick={saveSettings}
                                        >
                                            Save Changes
                                        </Button>
                                    </motion.div>
                                </Box>
                            </Box>
                        )}

                        {/* Appearance Tab */}
                        {tabValue === 1 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Appearance Settings
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Customize the look and feel of your application.
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={darkMode}
                                                    onChange={(e) => setDarkMode(e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label="Dark Mode"
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                                            Enable dark mode for a low-light interface
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={compactMode}
                                                    onChange={(e) => setCompactMode(e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label="Compact Mode"
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                                            Use a more compact interface layout
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl fullWidth sx={{ mt: 2 }}>
                                            <InputLabel id="theme-select-label">Theme Color</InputLabel>
                                            <Select
                                                labelId="theme-select-label"
                                                id="theme-select"
                                                value={themeColor}
                                                label="Theme Color"
                                                onChange={(e) => setThemeColor(e.target.value)}
                                            >
                                                <MenuItem value="blue">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                borderRadius: '50%',
                                                                bgcolor: '#1976d2',
                                                                mr: 1,
                                                            }}
                                                        />
                                                        Blue
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="purple">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                borderRadius: '50%',
                                                                bgcolor: '#9c27b0',
                                                                mr: 1,
                                                            }}
                                                        />
                                                        Purple
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="green">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                borderRadius: '50%',
                                                                bgcolor: '#388e3c',
                                                                mr: 1,
                                                            }}
                                                        />
                                                        Green
                                                    </Box>
                                                </MenuItem>
                                                <MenuItem value="orange">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Box
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                borderRadius: '50%',
                                                                bgcolor: '#f57c00',
                                                                mr: 1,
                                                            }}
                                                        />
                                                        Orange
                                                    </Box>
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            onClick={saveSettings}
                                        >
                                            Save Changes
                                        </Button>
                                    </motion.div>
                                </Box>
                            </Box>
                        )}

                        {/* Security Tab */}
                        {tabValue === 2 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Security Settings
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Manage your account security and password.
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Box component="form" onSubmit={passwordFormik.handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="currentPassword"
                                                name="currentPassword"
                                                label="Current Password"
                                                type="password"
                                                value={passwordFormik.values.currentPassword}
                                                onChange={passwordFormik.handleChange}
                                                onBlur={passwordFormik.handleBlur}
                                                error={
                                                    passwordFormik.touched.currentPassword &&
                                                    Boolean(passwordFormik.errors.currentPassword)
                                                }
                                                helperText={
                                                    passwordFormik.touched.currentPassword &&
                                                    passwordFormik.errors.currentPassword
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="newPassword"
                                                name="newPassword"
                                                label="New Password"
                                                type="password"
                                                value={passwordFormik.values.newPassword}
                                                onChange={passwordFormik.handleChange}
                                                onBlur={passwordFormik.handleBlur}
                                                error={
                                                    passwordFormik.touched.newPassword &&
                                                    Boolean(passwordFormik.errors.newPassword)
                                                }
                                                helperText={
                                                    passwordFormik.touched.newPassword &&
                                                    passwordFormik.errors.newPassword
                                                }
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                label="Confirm New Password"
                                                type="password"
                                                value={passwordFormik.values.confirmPassword}
                                                onChange={passwordFormik.handleChange}
                                                onBlur={passwordFormik.handleBlur}
                                                error={
                                                    passwordFormik.touched.confirmPassword &&
                                                    Boolean(passwordFormik.errors.confirmPassword)
                                                }
                                                helperText={
                                                    passwordFormik.touched.confirmPassword &&
                                                    passwordFormik.errors.confirmPassword
                                                }
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<LockIcon />}
                                                disabled={passwordFormik.isSubmitting}
                                            >
                                                Change Password
                                            </Button>
                                        </motion.div>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Box>
            </AnimationWrapper>
        </AppLayout>
    );
};

export default Settings;