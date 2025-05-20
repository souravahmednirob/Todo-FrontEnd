// src/pages/Tasks.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Tabs,
    Tab,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Divider,
    Grid,
    CircularProgress,
    useTheme,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Sort as SortIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
    Flag as FlagIcon,
    DeleteOutline as DeleteOutlineIcon,
    Edit as EditIcon,
    MoreVert as MoreVertIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    ErrorOutline as ErrorOutlineIcon,
    AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { format, isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { TodoItemResponseDto, Priority, Status } from '../types';
import todoService from '../services/todoService';
import AnimationWrapper from '../components/animations/AnimationWrapper';
import AppLayout from '../components/layout/AppLayout';

// Define interfaces for filter and sort
interface FilterOptions {
    status: Status | 'ALL';
    priority: Priority | 'ALL';
    date: 'today' | 'tomorrow' | 'week' | 'overdue' | 'all';
}

type SortOption = 'date-asc' | 'date-desc' | 'priority-asc' | 'priority-desc';

const Tasks: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // State for todos
    const [todos, setTodos] = useState<TodoItemResponseDto[]>([]);
    const [filteredTodos, setFilteredTodos] = useState<TodoItemResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for tabbing, filtering, sorting, and searching
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterOptions>({
        status: 'ALL',
        priority: 'ALL',
        date: 'all',
    });
    const [sortBy, setSortBy] = useState<SortOption>('date-asc');

    // Menu anchors
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
    const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
    const [todoMenuAnchorEl, setTodoMenuAnchorEl] = useState<{
        element: HTMLElement | null;
        id: number | null;
    }>({ element: null, id: null });

    // Load todos on component mount
    useEffect(() => {
        fetchTodos();
    }, []);

    // Apply filters and search when todos, filters, or search query changes
    useEffect(() => {
        applyFiltersAndSearch();
    }, [todos, filters, searchQuery, sortBy]);

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

    // Function to apply filters and search
    const applyFiltersAndSearch = () => {
        let result = [...todos];

        // Apply status filter
        if (filters.status !== 'ALL') {
            result = result.filter(todo => todo.status === filters.status);
        }

        // Apply priority filter
        if (filters.priority !== 'ALL') {
            result = result.filter(todo => todo.priority === filters.priority);
        }

        // Apply date filter
        if (filters.date !== 'all') {
            const currentDate = new Date();

            switch (filters.date) {
                case 'today':
                    result = result.filter(todo => isToday(new Date(todo.date)));
                    break;
                case 'tomorrow':
                    result = result.filter(todo => isTomorrow(new Date(todo.date)));
                    break;
                case 'week':
                    result = result.filter(todo => isThisWeek(new Date(todo.date)));
                    break;
                case 'overdue':
                    result = result.filter(
                        todo =>
                            todo.status === Status.PENDING &&
                            isPast(new Date(todo.date)) &&
                            !isToday(new Date(todo.date))
                    );
                    break;
                default:
                    break;
            }
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                todo =>
                    todo.title.toLowerCase().includes(query) ||
                    todo.description.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        result = sortTodos(result, sortBy);

        setFilteredTodos(result);
    };

    // Function to sort todos
    const sortTodos = (todoList: TodoItemResponseDto[], sortOption: SortOption) => {
        switch (sortOption) {
            case 'date-asc':
                return [...todoList].sort((a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                );
            case 'date-desc':
                return [...todoList].sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
            case 'priority-asc':
                return [...todoList].sort((a, b) => {
                    const priorities = { HIGH: 3, MEDIUM: 2, LOW: 1 };
                    return priorities[a.priority] - priorities[b.priority];
                });
            case 'priority-desc':
                return [...todoList].sort((a, b) => {
                    const priorities = { HIGH: 3, MEDIUM: 2, LOW: 1 };
                    return priorities[b.priority] - priorities[a.priority];
                });
            default:
                return todoList;
        }
    };

    // Function to handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);

        if (newValue === 0) { // All
            setFilters({ ...filters, status: 'ALL' });
        } else if (newValue === 1) { // Pending
            setFilters({ ...filters, status: Status.PENDING });
        } else if (newValue === 2) { // Completed
            setFilters({ ...filters, status: Status.COMPLETED });
        }
    };

    // Function to handle todo status toggle
    const handleToggleStatus = async (id: number, currentStatus: Status) => {
        try {
            const newStatus = currentStatus === Status.COMPLETED ? Status.PENDING : Status.COMPLETED;
            const response = await todoService.updateTodoStatus(id, newStatus);

            if (response.success) {
                setTodos(prevTodos =>
                    prevTodos.map(todo =>
                        todo.id === id ? { ...todo, ...response.data } : todo
                    )
                );
            }
        } catch (err) {
            console.error('Error updating todo status:', err);
        }
    };

    // Function to handle todo deletion
    const handleDeleteTodo = async (id: number) => {
        try {
            const response = await todoService.deleteTodo(id);

            if (response.success) {
                setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
                closeTodoMenu();
            }
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    };

    // Menu handlers
    const openFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const closeFilterMenu = () => {
        setFilterAnchorEl(null);
    };

    const openSortMenu = (event: React.MouseEvent<HTMLElement>) => {
        setSortAnchorEl(event.currentTarget);
    };

    const closeSortMenu = () => {
        setSortAnchorEl(null);
    };

    const openTodoMenu = (event: React.MouseEvent<HTMLElement>, id: number) => {
        event.stopPropagation();
        setTodoMenuAnchorEl({ element: event.currentTarget, id });
    };

    const closeTodoMenu = () => {
        setTodoMenuAnchorEl({ element: null, id: null });
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
                            My Tasks
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => navigate('/tasks/new')}
                                    sx={{ borderRadius: 2 }}
                                >
                                    New Task
                                </Button>
                            </motion.div>
                        </Box>
                    </Box>

                    {/* Filters and Search */}
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            mb: 3,
                            borderRadius: 2,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <TextField
                            placeholder="Search tasks..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ flexGrow: 1, minWidth: 200 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<FilterListIcon />}
                                onClick={openFilterMenu}
                                size="small"
                                color="primary"
                                sx={{ borderRadius: 2 }}
                            >
                                Filter
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<SortIcon />}
                                onClick={openSortMenu}
                                size="small"
                                color="primary"
                                sx={{ borderRadius: 2 }}
                            >
                                Sort
                            </Button>
                        </Box>

                        {/* Filter Menu */}
                        <Menu
                            anchorEl={filterAnchorEl}
                            open={Boolean(filterAnchorEl)}
                            onClose={closeFilterMenu}
                            PaperProps={{
                                elevation: 3,
                                sx: { width: 240, maxWidth: '100%' },
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
                                Priority
                            </Typography>
                            <MenuItem
                                onClick={() => {
                                    setFilters({ ...filters, priority: 'ALL' });
                                    closeFilterMenu();
                                }}
                                selected={filters.priority === 'ALL'}
                            >
                                <ListItemText>All Priorities</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setFilters({ ...filters, priority: Priority.HIGH });
                                    closeFilterMenu();
                                }}
                                selected={filters.priority === Priority.HIGH}
                            >
                                <ListItemIcon>
                                    <FlagIcon sx={{ color: theme.palette.error.main }} />
                                </ListItemIcon>
                                <ListItemText>High</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setFilters({ ...filters, priority: Priority.MEDIUM });
                                    closeFilterMenu();
                                }}
                                selected={filters.priority === Priority.MEDIUM}
                            >
                                <ListItemIcon>
                                    <FlagIcon sx={{ color: theme.palette.warning.main }} />
                                </ListItemIcon>
                                <ListItemText>Medium</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setFilters({ ...filters, priority: Priority.LOW });
                                    closeFilterMenu();
                                }}
                                selected={filters.priority === Priority.LOW}
                            >
                                <ListItemIcon>
                                    <FlagIcon sx={{ color: theme.palette.success.main }} />
                                </ListItemIcon>
                                <ListItemText>Low</ListItemText>
                            </MenuItem>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
                                Due Date
                            </Typography>
                            <MenuItem
                                onClick={() => {
                                    setFilters({ ...filters, date: 'all' });
                                    closeFilterMenu();
                                }}
                                selected={filters.date === 'all'}
                            >
                                <ListItemText>All Dates</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setFilters({ ...filters, date: 'today' });
                                    closeFilterMenu();
                                }}
                                selected={filters.date === 'today'}
                            >
                                <ListItemIcon>
                                    <AccessTimeIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText>Today</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setFilters({ ...filters, date: 'tomorrow' });
                                    closeFilterMenu();
                                }}
                                selected={filters.date === 'tomorrow'}
                            >
                                <ListItemIcon>
                                    <AccessTimeIcon color="secondary" />
                                </ListItemIcon>
                                <ListItemText>Tomorrow</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setFilters({ ...filters, date: 'week' });
                                    closeFilterMenu();
                                }}
                                selected={filters.date === 'week'}
                            >
                                <ListItemIcon>
                                    <AccessTimeIcon color="info" />
                                </ListItemIcon>
                                <ListItemText>This Week</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setFilters({ ...filters, date: 'overdue' });
                                    closeFilterMenu();
                                }}
                                selected={filters.date === 'overdue'}
                            >
                                <ListItemIcon>
                                    <ErrorOutlineIcon color="error" />
                                </ListItemIcon>
                                <ListItemText>Overdue</ListItemText>
                            </MenuItem>

                            <Divider sx={{ my: 1 }} />

                            <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setFilters({
                                            status: 'ALL',
                                            priority: 'ALL',
                                            date: 'all',
                                        });
                                        closeFilterMenu();
                                    }}
                                    color="primary"
                                >
                                    Reset Filters
                                </Button>
                            </Box>
                        </Menu>

                        {/* Sort Menu */}
                        <Menu
                            anchorEl={sortAnchorEl}
                            open={Boolean(sortAnchorEl)}
                            onClose={closeSortMenu}
                            PaperProps={{
                                elevation: 3,
                                sx: { width: 200, maxWidth: '100%' },
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    setSortBy('date-asc');
                                    closeSortMenu();
                                }}
                                selected={sortBy === 'date-asc'}
                            >
                                <ListItemIcon>
                                    <ArrowUpwardIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Date (Earliest)</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setSortBy('date-desc');
                                    closeSortMenu();
                                }}
                                selected={sortBy === 'date-desc'}
                            >
                                <ListItemIcon>
                                    <ArrowDownwardIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Date (Latest)</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setSortBy('priority-desc');
                                    closeSortMenu();
                                }}
                                selected={sortBy === 'priority-desc'}
                            >
                                <ListItemIcon>
                                    <ArrowDownwardIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Priority (High-Low)</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setSortBy('priority-asc');
                                    closeSortMenu();
                                }}
                                selected={sortBy === 'priority-asc'}
                            >
                                <ListItemIcon>
                                    <ArrowUpwardIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Priority (Low-High)</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Paper>

                    {/* Tabs */}
                    <Paper sx={{ borderRadius: 2, mb: 3 }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{
                                '& .MuiTab-root': {
                                    minHeight: 56,
                                    fontWeight: 500,
                                },
                            }}
                        >
                            <Tab
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography>All</Typography>
                                        <Chip
                                            label={todos.length}
                                            size="small"
                                            color="primary"
                                            sx={{ height: 24 }}
                                        />
                                    </Box>
                                }
                            />
                            <Tab
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography>Pending</Typography>
                                        <Chip
                                            label={todos.filter(t => t.status === Status.PENDING).length}
                                            size="small"
                                            color="warning"
                                            sx={{ height: 24 }}
                                        />
                                    </Box>
                                }
                            />
                            <Tab
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography>Completed</Typography>
                                        <Chip
                                            label={todos.filter(t => t.status === Status.COMPLETED).length}
                                            size="small"
                                            color="success"
                                            sx={{ height: 24 }}
                                        />
                                    </Box>
                                }
                            />
                        </Tabs>
                    </Paper>

                    {/* Tasks */}
                    <Box>
                        <AnimatePresence>
                            {filteredTodos.length === 0 ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        py: 8,
                                        textAlign: 'center',
                                    }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            No tasks found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {searchQuery
                                                ? "We couldn't find any tasks matching your search criteria."
                                                : "You don't have any tasks yet."}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={() => navigate('/tasks/new')}
                                            sx={{ mt: 2 }}
                                        >
                                            Add New Task
                                        </Button>
                                    </motion.div>
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {filteredTodos.map((todo) => (
                                        <Grid item xs={12} key={todo.id}>
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Paper
                                                    elevation={2}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 2,
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: 6,
                                                            transform: 'translateY(-2px)',
                                                        },
                                                        ...(todo.status === Status.COMPLETED && {
                                                            opacity: 0.7,
                                                            bgcolor: 'action.hover',
                                                        }),
                                                        ...(isPast(new Date(todo.date)) &&
                                                            todo.status === Status.PENDING &&
                                                            !isToday(new Date(todo.date)) && {
                                                                borderLeft: '4px solid',
                                                                borderColor: 'error.main',
                                                            }),
                                                        ...(isToday(new Date(todo.date)) && {
                                                            borderLeft: '4px solid',
                                                            borderColor: 'primary.main',
                                                        }),
                                                    }}
                                                    onClick={() => navigate(`/tasks/${todo.id}`)}
                                                >
                                                    {/* Priority indicator */}
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            right: 40,
                                                            width: 20,
                                                            height: 4,
                                                            bgcolor: getPriorityColor(todo.priority),
                                                            borderBottomLeftRadius: 2,
                                                            borderBottomRightRadius: 2,
                                                        }}
                                                    />

                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                        {/* Status toggle */}
                                                        <Box sx={{ pr: 2 }}>
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleStatus(todo.id, todo.status);
                                                                }}
                                                                size="small"
                                                                color={todo.status === Status.COMPLETED ? 'success' : 'default'}
                                                                sx={{
                                                                    '&:hover': {
                                                                        bgcolor: todo.status === Status.COMPLETED
                                                                            ? 'success.lighter'
                                                                            : 'action.hover'
                                                                    }
                                                                }}
                                                            >
                                                                {todo.status === Status.COMPLETED ? (
                                                                    <CheckCircleIcon />
                                                                ) : (
                                                                    <RadioButtonUncheckedIcon />
                                                                )}
                                                            </IconButton>
                                                        </Box>

                                                        {/* Todo details */}
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography
                                                                variant="subtitle1"
                                                                fontWeight={500}
                                                                sx={{
                                                                    textDecoration:
                                                                        todo.status === Status.COMPLETED ? 'line-through' : 'none',
                                                                    color: todo.status === Status.COMPLETED ? 'text.secondary' : 'text.primary',
                                                                }}
                                                            >
                                                                {todo.title}
                                                            </Typography>

                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{
                                                                    mb: 1,
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    height: 40,
                                                                    textDecoration:
                                                                        todo.status === Status.COMPLETED ? 'line-through' : 'none',
                                                                }}
                                                            >
                                                                {todo.description}
                                                            </Typography>

                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexWrap: 'wrap',
                                                                    alignItems: 'center',
                                                                    gap: 1,
                                                                    mt: 1,
                                                                }}
                                                            >
                                                                <Chip
                                                                    size="small"
                                                                    label={format(new Date(todo.date), 'MMM d, yyyy')}
                                                                    color={
                                                                        isToday(new Date(todo.date))
                                                                            ? 'primary'
                                                                            : isPast(new Date(todo.date)) &&
                                                                            todo.status === Status.PENDING &&
                                                                            !isToday(new Date(todo.date))
                                                                                ? 'error'
                                                                                : 'default'
                                                                    }
                                                                    variant="outlined"
                                                                    sx={{ height: 24 }}
                                                                />

                                                                {todo.time && (
                                                                    <Chip
                                                                        size="small"
                                                                        label={format(new Date(`2022-01-01T${todo.time}`), 'h:mm a')}
                                                                        variant="outlined"
                                                                        icon={<AccessTimeIcon fontSize="small" />}
                                                                        sx={{ height: 24 }}
                                                                    />
                                                                )}

                                                                <Chip
                                                                    size="small"
                                                                    label={todo.priority}
                                                                    sx={{
                                                                        height: 24,
                                                                        bgcolor: getPriorityColor(todo.priority) + '20',
                                                                        color: getPriorityColor(todo.priority),
                                                                        borderColor: getPriorityColor(todo.priority),
                                                                    }}
                                                                    variant="outlined"
                                                                    icon={
                                                                        <FlagIcon fontSize="small" />
                                                                    }
                                                                />
                                                            </Box>
                                                        </Box>

                                                        {/* Menu button */}
                                                        <Box>
                                                            <IconButton
                                                                onClick={(e) => openTodoMenu(e, todo.id)}
                                                                size="small"
                                                            >
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </Paper>
                                            </motion.div>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </AnimatePresence>

                        {/* Todo Menu */}
                        <Menu
                            anchorEl={todoMenuAnchorEl.element}
                            open={Boolean(todoMenuAnchorEl.element)}
                            onClose={closeTodoMenu}
                            PaperProps={{
                                elevation: 3,
                                sx: { width: 200, maxWidth: '100%' },
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    navigate(`/tasks/${todoMenuAnchorEl.id}/edit`);
                                    closeTodoMenu();
                                }}
                            >
                                <ListItemIcon>
                                    <EditIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Edit</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    const todo = todos.find((t) => t.id === todoMenuAnchorEl.id);
                                    if (todo) {
                                        handleToggleStatus(todo.id, todo.status);
                                    }
                                    closeTodoMenu();
                                }}
                            >
                                <ListItemIcon>
                                    {todos.find((t) => t.id === todoMenuAnchorEl.id)?.status === Status.COMPLETED ? (
                                        <RadioButtonUncheckedIcon fontSize="small" />
                                    ) : (
                                        <CheckCircleOutlineIcon fontSize="small" color="success" />
                                    )}
                                </ListItemIcon>
                                <ListItemText>
                                    {todos.find((t) => t.id === todoMenuAnchorEl.id)?.status === Status.COMPLETED
                                        ? 'Mark as Pending'
                                        : 'Mark as Completed'}
                                </ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={() => {
                                    if (todoMenuAnchorEl.id) {
                                        handleDeleteTodo(todoMenuAnchorEl.id);
                                    }
                                }}
                                sx={{ color: 'error.main' }}
                            >
                                <ListItemIcon>
                                    <DeleteOutlineIcon fontSize="small" color="error" />
                                </ListItemIcon>
                                <ListItemText>Delete</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </AnimationWrapper>
        </AppLayout>
    );
};

export default Tasks;