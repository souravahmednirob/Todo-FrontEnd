export interface AuthRequestDto {
    mail: string;
    password: string;
}

export interface User {
    id: number;
    mail: string;
}

export enum Priority {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

export enum Status {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED'
}

export enum Notify {
    YES = 'YES',
    NO = 'NO'
}

export interface TodoItemRequestDto {
    title: string;
    description: string;
    date: string;
    time?: string;
    priority: Priority;
    notify: Notify;
}

export interface TodoItemResponseDto {
    id: number;
    title: string;
    description: string;
    date: string;
    time?: string;
    priority: Priority;
    status: Status;
    notify: Notify;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

export interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    loading: boolean;
    error: string | null;
    user: User | null;
}

export interface TodoFilter {
    status?: Status;
    priority?: Priority;
    date?: string;
}