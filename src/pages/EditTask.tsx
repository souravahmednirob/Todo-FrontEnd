import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    IconButton,
    Grid,
    useTheme,
    CircularProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
} from '@mui/material';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Add as AddIcon,
    Event as EventIcon,
    Today as TodayIcon,
    Circle as CircleIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isToday,
    isSameMonth,
    isSameDay,
    addMonths,
    getDay,
    isWeekend,
    parseISO,
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { TodoItemResponseDto, Status, Priority } from '../types';
import todoService from '../services/todoService';
import AppLayout from '../components/layout/AppLayout';
import AnimationWrapper from '../components/animations/AnimationWrapper';

const Calendar: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // State for todos
    const [todos, setTodos] = useState<TodoItemResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for calendar view
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [dayTasks, setDayTasks] = useState<TodoItemResponseDto[]>([]);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);

    // Calendar calculations
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Adjust for week start (Sunday)
    const startDay = getDay(monthStart);

    // Load todos on component mount
    useEffect(() => {
        fetchTodos();
    }, []);

    // Function to fetch todos
    const fetchTodos = async () => {
        try {
            setLoading(true);
            const response = await todoService.getAllTodos();
            if (response.success) {
                setTodos(response.data);
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            console.error('Error fetching todos:', err);
            setError(err.response?.data?.message || 'Failed to fetch todos');
        } finally {
            setLoading(false);
        }
    };

    // Function to navigate between months
    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentDate(prevDate =>
            direction === 'prev' ? addMonths(prevDate, -1) : addMonths(prevDate, 1)
        );
    };

    // Function to get today
    const handleGoToday = () => {
        setCurrentDate(new Date());
    };

    // Function to handle day click
    const handleDayClick = (day: Date) => {
        setSelectedDay(day);

        // Find tasks for the selected day
        const tasksForDay = todos.filter(todo =>
            isSameDay(parseISO(todo.date), day)
        );

        setDayTasks(tasksForDay);
        setTaskDialogOpen(true);
    };

    // Function to get tasks for a day
    const getTasksForDay = (day: Date) => {
        return todos.filter(todo => isSameDay(parseISO(todo.date), day));
    };

    // Function to get priority color
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
    if (loading && todos.length === 0) {
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
    if (error && todos.length === 0) {
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
            <AnimationWrapper animation="fadeIn">
                <Box sx={{ pb: 4 }}>
                    {/* Header section */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold">
                            Calendar
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<TodayIcon />}
                                    onClick={handleGoToday}
                                >
                                    Today
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/tasks/new')}
                                >
                                    New Task
                                </Button>
                            </motion.div>
                        </Box>
                    </Box>

                    {/* Calendar navigation */}
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            mb: 3,
                            borderRadius: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <IconButton onClick={() => handleMonthChange('prev')}>
                            <ChevronLeftIcon />
                        </IconButton>

                        <Typography variant="h6" fontWeight="bold">
                            {format(currentDate, 'MMMM yyyy')}
                        </Typography>

                        <IconButton onClick={() => handleMonthChange('next')}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Paper>

                    {/* Calendar grid */}
                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        {/* Weekday headers */}
                        <Grid container>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                <Grid
                                    item
                                    key={day}
                                    xs={12 / 7}
                                    sx={{
                                        textAlign: 'center',
                                        py: 1,
                                        fontWeight: 'bold',
                                        color: index === 0 || index === 6 ? 'error.main' : 'text.primary',
                                    }}
                                >
                                    <Typography variant="subtitle2">{day}</Typography>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Calendar days */}
                        <Grid container sx={{ mt: 1 }}>
                            {/* Empty cells for days before the start of the month */}
                            {Array.from({ length: startDay }).map((_, index) => (
                                <Grid item xs={12 / 7} key={`empty-${index}`}>
                                    <Box
                                        sx={{
                                            height: 120,
                                            borderRadius: 2,
                                            p: 1,
                                        }}
                                    />
                                </Grid>
                            ))}

                            {/* Actual days of the month */}
                            {daysInMonth.map((day) => {
                                const tasksForDay = getTasksForDay(day);
                                const isCurrentDay = isToday(day);
                                const isCurrentMonth = isSameMonth(day, currentDate);

                                return (
                                    <Grid item xs={12 / 7} key={day.toString()}>
                                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                            <Paper
                                                elevation={isCurrentDay ? 2 : 0}
                                                sx={{
                                                    height: 120,
                                                    borderRadius: 2,
                                                    p: 1,
                                                    cursor: 'pointer',
                                                    border: '1px solid',
                                                    borderColor: isCurrentDay
                                                        ? 'primary.main'
                                                        : 'divider',
                                                    bgcolor: isCurrentDay
                                                        ? 'primary.lighter'
                                                        : isWeekend(day)
                                                            ? 'action.hover'
                                                            : 'background.paper',
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    opacity: isCurrentMonth ? 1 : 0.5,
                                                }}
                                                onClick={() => handleDayClick(day)}
                                            >
                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight={isCurrentDay ? 'bold' : 'medium'}
                                                    sx={{
                                                        color: isCurrentDay
                                                            ? 'primary.main'
                                                            : isWeekend(day)
                                                                ? 'error.main'
                                                                : 'text.primary',
                                                    }}
                                                >
                                                    {format(day, 'd')}
                                                </Typography>

                                                {/* Task indicators */}
                                                <Box sx={{ mt: 1 }}>
                                                    {tasksForDay.length > 0 ? (
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                            {tasksForDay.slice(0, 3).map((task) => (
                                                                <Box
                                                                    key={task.id}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 0.5,
                                                                        fontSize: '0.8rem',
                                                                        bgcolor: task.status === Status.COMPLETED
                                                                            ? 'success.lighter'
                                                                            : 'background.paper',
                                                                        px: 1,
                                                                        py: 0.5,
                                                                        borderRadius: 1,
                                                                        border: '1px solid',
                                                                        borderColor: task.status === Status.COMPLETED
                                                                            ? 'success.light'
                                                                            : getPriorityColor(task.priority),
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        color: task.status === Status.COMPLETED
                                                                            ? 'success.main'
                                                                            : 'text.primary',
                                                                    }}
                                                                >
                                                                    {task.status === Status.COMPLETED ? (
                                                                        <CheckCircleIcon
                                                                            fontSize="small"
                                                                            sx={{ fontSize: 12, color: 'success.main' }}
                                                                        />
                                                                    ) : (
                                                                        <CircleIcon
                                                                            fontSize="small"
                                                                            sx={{
                                                                                fontSize: 12,
                                                                                color: getPriorityColor(task.priority)
                                                                            }}
                                                                        />
                                                                    )}
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            whiteSpace: 'nowrap',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            textDecoration:
                                                                                task.status === Status.COMPLETED
                                                                                    ? 'line-through'
                                                                                    : 'none',
                                                                        }}
                                                                    >
                                                                        {task.title}
                                                                    </Typography>
                                                                </Box>
                                                            ))}

                                                            {tasksForDay.length > 3 && (
                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                    sx={{ mt: 0.5 }}
                                                                >
                                                                    + {tasksForDay.length - 3} more
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ height: '60%' }} />
                                                    )}
                                                </Box>
                                            </Paper>
                                        </motion.div>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Paper>

                    {/* Tasks Dialog */}
                    <Dialog
                        open={taskDialogOpen}
                        onClose={() => setTaskDialogOpen(false)}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle>
                            {selectedDay && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EventIcon color="primary" />
                                    <Typography variant="h6">
                                        Tasks for {format(selectedDay, 'MMMM d, yyyy')}
                                    </Typography>
                                </Box>
                            )}
                        </DialogTitle>
                        <DialogContent>
                            {dayTasks.length > 0 ? (
                                <List>
                                    {dayTasks.map((task) => (
                                        <React.Fragment key={task.id}>
                                            <ListItem
                                                button
                                                onClick={() => {
                                                    setTaskDialogOpen(false);
                                                    navigate(`/tasks/${task.id}`);
                                                }}
                                            >
                                                <ListItemIcon>
                                                    {task.status === Status.COMPLETED ? (
                                                        <CheckCircleIcon color="success" />
                                                    ) : (
                                                        <CircleIcon sx={{ color: getPriorityColor(task.priority) }} />
                                                    )}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                textDecoration:
                                                                    task.status === Status.COMPLETED ? 'line-through' : 'none',
                                                                color:
                                                                    task.status === Status.COMPLETED ? 'text.disabled' : 'text.primary',
                                                            }}
                                                        >
                                                            {task.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                            {task.time && (
                                                                <Chip
                                                                    size="small"
                                                                    label={format(
                                                                        new Date(`2022-01-01T${task.time}`),
                                                                        'h:mm a'
                                                                    )}
                                                                    variant="outlined"
                                                                    sx={{ height: 20 }}
                                                                />
                                                            )}
                                                            <Chip
                                                                size="small"
                                                                label={task.priority}
                                                                sx={{
                                                                    height: 20,
                                                                    bgcolor: getPriorityColor(task.priority) + '20',
                                                                    color: getPriorityColor(task.priority),
                                                                }}
                                                            />
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                        </React.Fragment>
                                    ))}
                                </List>
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        py: 4,
                                    }}
                                >
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                        No tasks scheduled for this day
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={() => {
                                            setTaskDialogOpen(false);
                                            navigate('/tasks/new');
                                        }}
                                        sx={{ mt: 2 }}
                                    >
                                        Add Task
                                    </Button>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setTaskDialogOpen(false)}>Close</Button>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    setTaskDialogOpen(false);
                                    navigate('/tasks/new');
                                }}
                            >
                                New Task
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </AnimationWrapper>
        </AppLayout>
    );
};

export default Calendar;