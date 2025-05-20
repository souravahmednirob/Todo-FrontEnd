import api from './api';
import { AuthRequestDto, ApiResponse } from '../types';

export const authService = {
    async register(authRequest: AuthRequestDto): Promise<ApiResponse<string>> {
        const response = await api.post<ApiResponse<string>>('/auth/register', authRequest);
        return response.data;
    },

    async login(authRequest: AuthRequestDto): Promise<ApiResponse<string>> {
        const response = await api.post<ApiResponse<string>>('/auth/login', authRequest);
        if (response.data.success && response.data.data) {
            localStorage.setItem('token', response.data.data);
        }
        return response.data;
    },

    logout(): void {
        localStorage.removeItem('token');
    },

    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        return !!token;
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    }
};

export default authService;