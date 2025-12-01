
//console.log('API Base URL:', REACT_APP_API_BASE_URL);

//export const REACT_APP_API_BASE_URL =  'http://localhost:8080/api';
export const REACT_APP_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';


type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiOptions {
  method?: RequestMethod;
  body?: any;
  headers?: Record<string, string>;
}

export const api = {
  getToken: () => localStorage.getItem('token'),
  
  setToken: (token: string) => localStorage.setItem('token', token),
  
  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  request: async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const token = api.getToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}${endpoint}`, config);

      // Handle 401 Unauthorized globally
      if (response.status === 401) {
        api.removeToken();
        window.location.hash = '#/login';
        throw new Error('Session expired. Please login again.');
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data as T;
    } catch (error: any) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }
};