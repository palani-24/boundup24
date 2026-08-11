const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://boundup24-api.vercel.app/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('boundup_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('boundup_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('boundup_token');
};

export const apiFetch = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred during API request');
  }

  return data;
};
