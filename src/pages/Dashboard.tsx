import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    LinearProgress,
    Divider,
    Chip,
    IconButton,
    CircularProgress,
    Badge,
    useTheme,
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    DonutLarge as DonutLargeIcon,
    AccessTime as AccessTimeIcon,
    CalendarToday as CalendarTodayIcon,
    Flag as FlagIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { TodoItemResponseDto, Priority, Status } from '../types';
import todoService from '../services/todoService';
import AnimationWrapper from '../components/animations/AnimationWrapper';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../store/AuthContext';

const Dashboard: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useAuth();
    const [todos, setTodos] = useState<TodoItemResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Calculate statistics
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.status === Status.COMPLETED).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const highPriorityTasks = todos.filter(todo => todo.priority === Priority.HIGH).length;
    const highPriorityPending = todos.filter(todo =>
        todo.priority === Priority.HIGH && todo.status === Status.PENDING
    ).length;

    // Get today's tasks
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = todos.filter(todo => todo.date === today);
    const upcomingTasks = todos.filter(todo =>
        todo.date > today && todo.status === Status.PENDING
    ).slice(0, 5); // Get next 5 upcoming tasks

    // Recent tasks
    const recentTasks = [...todos]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                setLoading(true);
                const response = await todoService.getAllTodos();
                if (response.success) {
                    setTodos(response.data);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                console.error('Error fetching todos:', error);
                setError('Failed to fetch todos. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTodos();
    }, []);

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

    if (error) {
        return (
            <AppLayout>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '80vh',
                    }}
                >
                    <Typography variant="h6" color="error" gutterBottom>
                        {error}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        Try Again
                    </Button>
                </Box>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Box sx={{ pb: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4,
                    }}
                >
                    <AnimationWrapper animation="fadeInDown">
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Hello, {state.user?.mail.split('@')[0] || 'User'}!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {format(new Date(), "EEEE, MMMM do, yyyy")}
                        </Typography>
                    </AnimationWrapper>

                    <AnimationWrapper animation="fadeIn" delay={0.3}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                size="large"
                                onClick={() => navigate('/tasks/new')}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.2,
                                    boxShadow: 4,
                                }}
                            >
                                Add New Task
                            </Button>
                        </motion.div>
                    </AnimationWrapper>
                </Box>

                <Grid container spacing={3}>
                    {/* Statistics Cards */}
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} lg={3}>
                                <AnimationWrapper animation="fadeInUp" delay={0.1}>
                                    <Card
                                        component={motion.div}
                                        whileHover={{ translateY: -5 }}
                                        sx={{
                                            height: '100%',
                                            borderTop: '4px solid',
                                            borderColor: 'primary.main',
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Total Tasks
                                            </Typography>
                                            <Typography variant="h4" fontWeight="bold">
                                                {totalTasks}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </AnimationWrapper>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={3}>
                                <AnimationWrapper animation="fadeInUp" delay={0.2}>
                                    <Card
                                        component={motion.div}
                                        whileHover={{ translateY: -5 }}
                                        sx={{
                                            height: '100%',
                                            borderTop: '4px solid',
                                            borderColor: 'success.main',
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Completed
                                            </Typography>
                                            <Typography variant="h4" fontWeight="bold">
                                                {completedTasks}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </AnimationWrapper>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={3}>
                                <AnimationWrapper animation="fadeInUp" delay={0.3}>
                                    <Card
                                        component={motion.div}
                                        whileHover={{ translateY: -5 }}
                                        sx={{
                                            height: '100%',
                                            borderTop: '4px solid',
                                            borderColor: 'warning.main',
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Pending
                                            </Typography>
                                            <Typography variant="h4" fontWeight="bold">
                                                {pendingTasks}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </AnimationWrapper>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={3}>
                                <AnimationWrapper animation="fadeInUp" delay={0.4}>
                                    <Card
                                        component={motion.div}
                                        whileHover={{ translateY: -5 }}
                                        sx={{
                                            height: '100%',
                                            borderTop: '4px solid',
                                            borderColor: 'error.main',
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                High Priority
                                            </Typography>
                                            <Typography variant="h4" fontWeight="bold">
                                                {highPriorityTasks}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {highPriorityPending} pending
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </AnimationWrapper>
                            </Grid>

                            {/* Progress Card */}
                            <Grid item xs={12}>
                                <AnimationWrapper animation="fadeInUp" delay={0.5}>
                                    <Card component={motion.div} whileHover={{ translateY: -5 }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6" fontWeight="bold">
                                                    Completion Rate
                                                </Typography>
                                                <DonutLargeIcon color="primary" />
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Box sx={{ width: '100%', mr: 1 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={completionRate}
                                                        sx={{
                                                            height: 10,
                                                            borderRadius: 5,
                                                            bgcolor: 'background.paper',
                                                            '& .MuiLinearProgress-bar': {
                                                                borderRadius: 5,
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {completionRate}%
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Typography variant="body2" color="text.secondary">
                                                You've completed {completedTasks} out of {totalTasks} tasks
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </AnimationWrapper>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Today's Tasks */}
                    <Grid item xs={12} md={4}>
                        <AnimationWrapper animation="fadeInLeft" delay={0.3}>
                            <Card
                                component={motion.div}
                                whileHover={{ translateY: -5 }}
                                sx={{ height: '100%', minHeight: 300 }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            Today's Tasks
                                        </Typography>
                                        <Chip
                                            label={`${todayTasks.length} tasks`}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    {todayTasks.length === 0 ? (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                py: 6,
                                            }}
                                        >
                                            <CalendarTodayIcon
                                                sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }}
                                            />
                                            <Typography variant="body1" color="text.secondary">
                                                No tasks scheduled for today
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={() => navigate('/tasks/new')}
                                                sx={{ mt: 2 }}
                                            >
                                                Add Task
                                            </Button>
                                        </Box>
                                    ) : (
                                        <>
                                            {todayTasks.map((task, index) => (
                                                <Box
                                                    key={task.id}
                                                    component={motion.div}
                                                    whileHover={{ x: 5 }}
                                                    sx={{
                                                        p: 1.5,
                                                        mb: 1,
                                                        borderRadius: 2,
                                                        bgcolor: 'background.paper',
                                                        boxShadow: 1,
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            boxShadow: 3,
                                                        },
                                                    }}
                                                    onClick={() => navigate(`/tasks/${task.id}`)}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Badge
                                                            color={
                                                                task.priority === Priority.HIGH
                                                                    ? 'error'
                                                                    : task.priority === Priority.MEDIUM
                                                                        ? 'warning'
                                                                        : 'success'
                                                            }
                                                            variant="dot"
                                                            sx={{ mr: 2 }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: 20,
                                                                    height: 20,
                                                                    borderRadius: '50%',
                                                                    border: '2px solid',
                                                                    borderColor: task.status === Status.COMPLETED ? 'success.main' : 'grey.300',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                {task.status === Status.COMPLETED && (
                                                                    <Box
                                                                        sx={{
                                                                            width: 10,
                                                                            height: 10,
                                                                            borderRadius: '50%',
                                                                            bgcolor: 'success.main',
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Badge>
                                                        <Box>
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight="medium"
                                                                sx={{
                                                                    textDecoration:
                                                                        task.status === Status.COMPLETED ? 'line-through' : 'none',
                                                                }}
                                                            >
                                                                {task.title}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {task.time || 'All day'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <IconButton size="small">
                                                        <MoreVertIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </AnimationWrapper>
                    </Grid>

                    {/* Recent Tasks */}
                    <Grid item xs={12} md={6}>
                        <AnimationWrapper animation="fadeInUp" delay={0.4}>
                            <Card component={motion.div} whileHover={{ translateY: -5 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            Recent Activity
                                        </Typography>
                                        <AccessTimeIcon color="action" />
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    {recentTasks.length === 0 ? (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                py: 4,
                                            }}
                                        >
                                            <Typography variant="body1" color="text.secondary">
                                                No recent activity
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Box>
                                            {recentTasks.map((task) => (
                                                <Box
                                                    key={task.id}
                                                    component={motion.div}
                                                    whileHover={{ x: 5 }}
                                                    sx={{
                                                        p: 1.5,
                                                        mb: 1,
                                                        borderRadius: 2,
                                                        bgcolor: 'background.paper',
                                                        boxShadow: 1,
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            boxShadow: 3,
                                                        },
                                                    }}
                                                    onClick={() => navigate(`/tasks/${task.id}`)}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {task.title}
                                                        </Typography>
                                                        <Chip
                                                            label={task.status}
                                                            size="small"
                                                            color={task.status === Status.COMPLETED ? 'success' : 'default'}
                                                            sx={{ height: 24 }}
                                                        />
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mt: 1,
                                                        }}
                                                    >
                                                        <Typography variant="caption" color="text.secondary">
                                                            Last updated: {format(new Date(task.updatedAt), 'MMM d, h:mm a')}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <FlagIcon
                                                                sx={{
                                                                    fontSize: 16,
                                                                    mr: 0.5,
                                                                    color: getPriorityColor(task.priority),
                                                                }}
                                                            />
                                                            <Typography variant="caption">{task.priority}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </AnimationWrapper>
                    </Grid>

                    {/* Upcoming Tasks */}
                    <Grid item xs={12} md={6}>
                        <AnimationWrapper animation="fadeInUp" delay={0.5}>
                            <Card component={motion.div} whileHover={{ translateY: -5 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            Upcoming Tasks
                                        </Typography>
                                        <CalendarTodayIcon color="action" />
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    {upcomingTasks.length === 0 ? (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                py: 4,
                                            }}
                                        >
                                            <Typography variant="body1" color="text.secondary">
                                                No upcoming tasks
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={() => navigate('/tasks/new')}
                                                sx={{ mt: 2 }}
                                            >
                                                Add Task
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box>
                                            {upcomingTasks.map((task) => (
                                                <Box
                                                    key={task.id}
                                                    component={motion.div}
                                                    whileHover={{ x: 5 }}
                                                    sx={{
                                                        p: 1.5,
                                                        mb: 1,
                                                        borderRadius: 2,
                                                        bgcolor: 'background.paper',
                                                        boxShadow: 1,
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            boxShadow: 3,
                                                        },
                                                    }}
                                                    onClick={() => navigate(`/tasks/${task.id}`)}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {task.title}
                                                        </Typography>
                                                        <Chip
                                                            label={format(new Date(task.date), 'MMM d')}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            sx={{ height: 24 }}
                                                        />
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mt: 1,
                                                        }}
                                                    >
                                                        <Typography variant="caption" color="text.secondary">
                                                            {task.time ? format(new Date(`2022-01-01T${task.time}`), 'h:mm a') : 'All day'}
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <FlagIcon
                                                                sx={{
                                                                    fontSize: 16,
                                                                    mr: 0.5,
                                                                    color: getPriorityColor(task.priority),
                                                                }}
                                                            />
                                                            <Typography variant="caption">{task.priority}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            ))}

                                            {upcomingTasks.length > 0 && (
                                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        onClick={() => navigate('/tasks')}
                                                    >
                                                        View All Tasks
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </AnimationWrapper>
                    </Grid>
                </Grid>
            </Box>
        </AppLayout>
    );
};

export default Dashboard;