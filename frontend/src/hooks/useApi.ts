import { useState, useCallback } from 'react';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = useCallback(async <T>(
    endpoint: string, 
    options: ApiOptions = {}
  ): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const { method = 'GET', body, headers = {} } = options;
      // Ensure headers is always an object
      const safeHeaders = headers || {};
      
      // Headers default
      const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(headers || {})
      };

      // TODO: Add authentication token when auth is implemented
      // const token = getAuthToken();
      // if (token) {
      //   defaultHeaders.Authorization = `Bearer ${token}`;
      // }

      const config: RequestInit = {
        method,
        headers: defaultHeaders,
        ...(method !== 'GET' && body !== undefined ? { body: JSON.stringify(body) } : {})
      };

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const url = endpoint.startsWith('/') ? `${baseUrl}/api${endpoint}` : `${baseUrl}/api/${endpoint}`;
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // Se non riusciamo a parsare l'errore JSON, usiamo il messaggio di default
        }
        
        throw new Error(errorMessage);
      }

      // Handle empty responses (e.g., DELETE requests)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      } else {
        return {} as T;
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Convenience methods for common HTTP methods
  const get = useCallback(<T>(endpoint: string, headers?: Record<string, string>) => 
    apiCall<T>(endpoint, { method: 'GET', headers }), [apiCall]);

  const post = useCallback(<T>(endpoint: string, body?: any, headers?: Record<string, string>) => 
    apiCall<T>(endpoint, { method: 'POST', body, headers }), [apiCall]);

  const put = useCallback(<T>(endpoint: string, body?: any, headers?: Record<string, string>) => 
    apiCall<T>(endpoint, { method: 'PUT', body, headers }), [apiCall]);

  const del = useCallback(<T>(endpoint: string, headers?: Record<string, string>) => 
    apiCall<T>(endpoint, { method: 'DELETE', headers }), [apiCall]);

  const patch = useCallback(<T>(endpoint: string, body?: any, headers?: Record<string, string>) => 
    apiCall<T>(endpoint, { method: 'PATCH', body, headers }), [apiCall]);

  return {
    loading,
    error,
    apiCall,
    clearError,
    // Convenience methods
    get,
    post,
    put,
    delete: del,
    patch
  };
}
