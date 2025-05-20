import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    Chip,
    Divider,
    IconButton,
    CircularProgress,
    Grid,
    useTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Flag as FlagIcon,
    AccessTime as AccessTimeIcon,
    Notifications as NotificationsIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
    CalendarToday as CalendarTodayIcon,
    Event as EventIcon,
} from '@mui/icons-material';
import { format, isPast, isToday } from 'date-fns';
import { motion } from 'framer-motion';
import { TodoItemResponseDto, Status, Priority, Notify } from '../types';
import todoService from '../services/todoService';
import AppLayout from '../components/layout/AppLayout';
import AnimationWrapper from '../components/animations/AnimationWrapper';

const TaskDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();

    const [todo, setTodo] = useState<TodoItemResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        const fetchTodo = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await todoService.getTodoById(Number(id));

                if (response.success) {
                    setTodo(response.data);
                } else {
                    setError(response.message);
                }
            } catch (err: any) {
                console.error('Error fetching todo:', err);
                setError(err.response?.data?.message || 'Failed to fetch task details');
            } finally {
                setLoading(false);
            }
        };

        fetchTodo();
    }, [id]);

    const handleStatusToggle = async () => {
        if (!todo) return;

        try {
            const newStatus = todo.status === Status.COMPLETED ? Status.PENDING : Status.COMPLETED;
            const response = await todoService.updateTodoStatus(todo.id, newStatus);

            if (response.success) {
                setTodo(response.data);
            }
        } catch (err) {
            console.error('Error updating todo status:', err);
        }
    };

    const handleDelete = async () => {
        if (!todo) return;

        try {
            const response = await todoService.deleteTodo(todo.id);

            if (response.success) {
                navigate('/tasks');
            }
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    };

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

    // Render loading state
    if (loading) {
        return (
            <AppLayout>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '80vh',
                    }}
                >
                    <CircularProgress />
                </Box>
            </AppLayout>
        );
    }

    // Render error state
    if (error || !todo) {
        return (
            <AppLayout>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        height: '80vh',
                    }}
                >
                    <Typography variant="h6" color="error" gutterBottom>
                        {error || 'Task not found'}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/tasks')}
                        sx={{ mt: 2 }}
                    >
                        Back to Tasks
                    </Button>
                </Box>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <AnimationWrapper animation="fadeIn">
                <Box sx={{ maxWidth: 800, mx: 'auto', pb: 4 }}>
                    {/* Header with back button */}
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
                            Task Details
                        </Typography>
                    </Box>

                    <Paper
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        elevation={3}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            position: 'relative',
                            overflow: 'hidden',
                            ...(todo.status === Status.COMPLETED && {
                                bgcolor: 'action.hover',
                            }),
                        }}
                    >
                        {/* Priority indicator */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 6,
                                bgcolor: getPriorityColor(todo.priority),
                            }}
                        />

                        {/* Task title and actions */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: 2,
                                mt: 1,
                            }}
                        >
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                sx={{
                                    textDecoration: todo.status === Status.COMPLETED ? 'line-through' : 'none',
                                    color: todo.status === Status.COMPLETED ? 'text.secondary' : 'text.primary',
                                }}
                            >
                                {todo.title}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="outlined"
                                        color={todo.status === Status.COMPLETED ? 'warning' : 'success'}
                                        startIcon={
                                            todo.status === Status.COMPLETED ? (
                                                <RadioButtonUncheckedIcon />
                                            ) : (
                                                <CheckCircleIcon />
                                            )
                                        }
                                        onClick={handleStatusToggle}
                                    >
                                        {todo.status === Status.COMPLETED ? 'Mark Pending' : 'Mark Done'}
                                    </Button>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        onClick={() => navigate(`/tasks/${todo.id}/edit`)}
                                    >
                                        Edit
                                    </Button>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => setConfirmDelete(true)}
                                    >
                                        Delete
                                    </Button>
                                </motion.div>
                            </Box>
                        </Box>

                        {/* Status chip */}
                        <Box sx={{ mb: 4 }}>
                            <Chip
                                label={todo.status}
                                color={todo.status === Status.COMPLETED ? 'success' : 'warning'}
                                sx={{ fontWeight: 500 }}
                            />
                        </Box>

                        {/* Description */}
                        <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', mb: 4 }}>
                            {todo.description}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        {/* Task details */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Due Date
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color:
                                            isPast(new Date(todo.date)) &&
                                            todo.status === Status.PENDING &&
                                            !isToday(new Date(todo.date))
                                                ? 'error.main'
                                                : 'text.primary',
                                    }}
                                >
                                    {format(new Date(todo.date), 'MMMM d, yyyy')}
                                    {isToday(new Date(todo.date)) && (
                                        <Chip
                                            label="Today"
                                            size="small"
                                            color="primary"
                                            sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                                        />
                                    )}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Time
                                    </Typography>
                                </Box>
                                <Typography variant="body1">
                                    {todo.time
                                        ? format(new Date(`2022-01-01T${todo.time}`), 'h:mm a')
                                        : 'All day'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <FlagIcon sx={{ mr: 1, color: getPriorityColor(todo.priority) }} />
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Priority
                                    </Typography>
                                </Box>
                                <Chip
                                    label={todo.priority}
                                    sx={{
                                        bgcolor: getPriorityColor(todo.priority) + '20',
                                        color: getPriorityColor(todo.priority),
                                        borderColor: getPriorityColor(todo.priority),
                                        fontWeight: 500,
                                    }}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <NotificationsIcon
                                        sx={{
                                            mr: 1,
                                            color: todo.notify === Notify.YES ? 'primary.main' : 'text.disabled',
                                        }}
                                    />
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Notifications
                                    </Typography>
                                </Box>
                                <Typography variant="body1">
                                    {todo.notify === Notify.YES ? 'Enabled' : 'Disabled'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        Created At
                                    </Typography>
                                </Box>
                                <Typography variant="body1">
                                    {format(new Date(todo.createdAt), 'MMM d, yyyy h:mm a')}
                                </Typography>
                            </Grid>

                            {todo.status === Status.COMPLETED && todo.completedAt && (
                                <Grid item xs={12} sm={6}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Completed At
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1">
                                        {format(new Date(todo.completedAt), 'MMM d, yyyy h:mm a')}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Box>
            </AnimationWrapper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete Task?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this task? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            handleDelete();
                            setConfirmDelete(false);
                        }}
                        color="error"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </AppLayout>
    );
};

export default TaskDetail;