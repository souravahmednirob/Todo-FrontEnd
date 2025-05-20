import api from './api';
import {
    TodoItemRequestDto,
    TodoItemResponseDto,
    ApiResponse,
    PagedResponse,
    Status,
    Priority
} from '../types';

export const todoService = {
    async createTodo(todoDto: TodoItemRequestDto): Promise<ApiResponse<TodoItemResponseDto>> {
        const response = await api.post<ApiResponse<TodoItemResponseDto>>('/todos', todoDto);
        return response.data;
    },

    async getTodoById(id: number): Promise<ApiResponse<TodoItemResponseDto>> {
        const response = await api.get<ApiResponse<TodoItemResponseDto>>(`/todos/${id}`);
        return response.data;
    },

    async getAllTodos(): Promise<ApiResponse<TodoItemResponseDto[]>> {
        const response = await api.get<ApiResponse<TodoItemResponseDto[]>>('/todos');
        return response.data;
    },

    async getTodosPaginated(page: number = 0, size: number = 10): Promise<ApiResponse<PagedResponse<TodoItemResponseDto>>> {
        const response = await api.get<ApiResponse<PagedResponse<TodoItemResponseDto>>>(`/todos/paginated?page=${page}&size=${size}`);
        return response.data;
    },

    async getTodosByStatus(status: Status): Promise<ApiResponse<TodoItemResponseDto[]>> {
        const response = await api.get<ApiResponse<TodoItemResponseDto[]>>(`/todos/status/${status}`);
        return response.data;
    },

    async getTodosByPriority(priority: Priority): Promise<ApiResponse<TodoItemResponseDto[]>> {
        const response = await api.get<ApiResponse<TodoItemResponseDto[]>>(`/todos/priority/${priority}`);
        return response.data;
    },

    async getTodosByDate(date: string): Promise<ApiResponse<TodoItemResponseDto[]>> {
        const response = await api.get<ApiResponse<TodoItemResponseDto[]>>(`/todos/date/${date}`);
        return response.data;
    },

    async updateTodo(id: number, todoDto: TodoItemRequestDto): Promise<ApiResponse<TodoItemResponseDto>> {
        const response = await api.put<ApiResponse<TodoItemResponseDto>>(`/todos/${id}`, todoDto);
        return response.data;
    },

    async updateTodoStatus(id: number, status: Status): Promise<ApiResponse<TodoItemResponseDto>> {
        const response = await api.patch<ApiResponse<TodoItemResponseDto>>(`/todos/${id}/status?status=${status}`);
        return response.data;
    },

    async deleteTodo(id: number): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`/todos/${id}`);
        return response.data;
    }
};

export default todoService;