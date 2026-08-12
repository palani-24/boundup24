const getApiBase = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }
  return '/api';
};

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

  try {
    const apiBase = getApiBase();
    const response = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    let data: any = {};
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text ? text.slice(0, 150) : `HTTP Error ${response.status}` };
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Server request failed (${response.status})`);
    }

    return data;
  } catch (err: any) {
    if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('NetworkError'))) {
      throw new Error('Unable to reach API server. Please refresh or try Instant Demo Login.');
    }
    throw err;
  }
};

export const api = {
  get: async (endpoint: string, config?: { params?: Record<string, any> }): Promise<any> => {
    let url = endpoint;
    if (config?.params) {
      const searchParams = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    const res = await apiFetch(url, { method: 'GET' });
    return { data: res };
  },
  post: async (endpoint: string, body?: any, config?: { headers?: Record<string, string> }): Promise<any> => {
    const isFormData = body instanceof FormData;
    const res = await apiFetch(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      headers: config?.headers,
    });
    return { data: res };
  },
  delete: async (endpoint: string): Promise<any> => {
    const res = await apiFetch(endpoint, { method: 'DELETE' });
    return { data: res };
  },
};
