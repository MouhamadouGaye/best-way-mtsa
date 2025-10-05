import { api } from './api';
import type { User } from '@/types';

export const authService = {
  register: (data: {
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => api.post('/users/register', data),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  getCurrentUser: () => api.get<User>('/users/me'),

  logout: () => api.post('/auth/logout'),
};
