import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Grid,
    Paper,
    Typography,
    Divider,
    IconButton,
    useTheme,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    HighlightOff as HighlightOffIcon,
    Flag as FlagIcon,
    Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { TodoItemRequestDto, TodoItemResponseDto, Priority, Notify } from '../../types';
import todoService from '../../services/todoService';
import AnimationWrapper from '../animations/AnimationWrapper';

interface TodoFormProps {
    initialValues?: TodoItemResponseDto;
    isEditing: boolean;
    onSuccess?: (todo: TodoItemResponseDto) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ initialValues, isEditing, onSuccess }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            title: initialValues?.title || '',
            description: initialValues?.description || '',
            date: initialValues?.date ? new Date(initialValues.date) : new Date(),
            time: initialValues?.time ? new Date(`2022-01-01T${initialValues.time}`) : null,
            priority: initialValues?.priority || Priority.MEDIUM,
            notify: initialValues?.notify || Notify.NO,
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            description: Yup.string().required('Description is required'),
            date: Yup.date().required('Date is required'),
            priority: Yup.string().required('Priority is required'),
            notify: Yup.string().required('Notification preference is required'),
        }),
        onSubmit: async (values) => {
            try {
                setSubmitting(true);
                setError(null);

                const todoDto: TodoItemRequestDto = {
                    title: values.title,
                    description: values.description,
                    date: format(values.date, 'yyyy-MM-dd'),
                    time: values.time ? format(values.time, 'HH:mm:ss') : undefined,
                    priority: values.priority as Priority,
                    notify: values.notify as Notify,
                };

                let response;
                if (isEditing && initialValues) {
                    response = await todoService.updateTodo(initialValues.id, todoDto);
                } else {
                    response = await todoService.createTodo(todoDto);
                }

                if (response.success) {
                    if (onSuccess) {
                        onSuccess(response.data);
                    } else {
                        navigate('/tasks');
                    }
                } else {
                    setError(response.message || 'Failed to save todo');
                }
            } catch (err: any) {
                console.error('Error saving todo:', err);
                setError(err.response?.data?.message || 'An error occurred while saving the todo');
            } finally {
                setSubmitting(false);
            }
        },
    });

    const getPriorityColor = (priority: Priority) => {
        switch (priority) {
            case Priority.HIGH:
                return theme.palette.error.main;
            case Priority.MEDIUM:
                return theme.palette.warning.main;
            case Priority.LOW:
                return theme.palette.success.main;
            default:
                return theme.palette.info.main;
        }
    };

    return (
        <AnimationWrapper animation="fadeIn">
            <Box sx={{ maxWidth: 800, mx: 'auto', pb: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 4,
                    }}
                >
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{ mr: 2 }}
                        component={motion.button}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" fontWeight="bold">
                        {isEditing ? 'Edit Task' : 'Create New Task'}
                    </Typography>
                </Box>

                {error && (
                    <Paper
                        sx={{
                            p: 2,
                            mb: 3,
                            bgcolor: 'error.light',
                            color: 'error.dark',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="body2">{error}</Typography>
                        <IconButton
                            size="small"
                            sx={{ ml: 'auto' }}
                            onClick={() => setError(null)}
                        >
                            <HighlightOffIcon fontSize="small" />
                        </IconButton>
                    </Paper>
                )}

                <Paper
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    elevation={3}
                    sx={{ p: 4, borderRadius: 3 }}
                >
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="title"
                                    name="title"
                                    label="Task Title"
                                    placeholder="Enter task title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                    InputProps={{
                                        sx: {
                                            fontSize: '1.1rem',
                                            fontWeight: 500,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="description"
                                    name="description"
                                    label="Description"
                                    placeholder="Enter task description"
                                    multiline
                                    rows={4}
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Due Date"
                                        value={formik.values.date}
                                        onChange={(newValue) => {
                                            formik.setFieldValue('date', newValue);
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: formik.touched.date && Boolean(formik.errors.date),
                                                helperText: formik.touched.date && formik.errors.date,
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        label="Time (Optional)"
                                        value={formik.values.time}
                                        onChange={(newValue) => {
                                            formik.setFieldValue('time', newValue);
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={formik.touched.priority && Boolean(formik.errors.priority)}>
                                    <InputLabel id="priority-label">Priority</InputLabel>
                                    <Select
                                        labelId="priority-label"
                                        id="priority"
                                        name="priority"
                                        value={formik.values.priority}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        label="Priority"
                                        startAdornment={
                                            <FlagIcon
                                                sx={{
                                                    color: getPriorityColor(formik.values.priority as Priority),
                                                    mr: 1
                                                }}
                                            />
                                        }
                                    >
                                        <MenuItem value={Priority.HIGH}>High</MenuItem>
                                        <MenuItem value={Priority.MEDIUM}>Medium</MenuItem>
                                        <MenuItem value={Priority.LOW}>Low</MenuItem>
                                    </Select>
                                    {formik.touched.priority && formik.errors.priority && (
                                        <FormHelperText>{formik.errors.priority}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={formik.touched.notify && Boolean(formik.errors.notify)}>
                                    <InputLabel id="notify-label">Notification</InputLabel>
                                    <Select
                                        labelId="notify-label"
                                        id="notify"
                                        name="notify"
                                        value={formik.values.notify}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        label="Notification"
                                        startAdornment={
                                            <NotificationsIcon
                                                sx={{
                                                    color: formik.values.notify === Notify.YES ? 'primary.main' : 'text.disabled',
                                                    mr: 1
                                                }}
                                            />
                                        }
                                    >
                                        <MenuItem value={Notify.YES}>Yes</MenuItem>
                                        <MenuItem value={Notify.NO}>No</MenuItem>
                                    </Select>
                                    {formik.touched.notify && formik.errors.notify && (
                                        <FormHelperText>{formik.errors.notify}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        mt: 2,
                                        gap: 2,
                                    }}
                                >
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate(-1)}
                                            sx={{ px: 4 }}
                                        >
                                            Cancel
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={submitting}
                                            sx={{ px: 4 }}
                                        >
                                            {submitting
                                                ? isEditing ? 'Updating...' : 'Creating...'
                                                : isEditing ? 'Update Task' : 'Create Task'}
                                        </Button>
                                    </motion.div>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </AnimationWrapper>
    );
};

export default TodoForm;