
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';

// This is just an example template for backend engineers
// Replace with actual API calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Example fetch function
const fetchData = async (endpoint: string) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

// Example post function
const postData = async (endpoint: string, data: any) => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

// Example hook for fetching data
export const useApiGet = <T>(endpoint: string, queryKey: string[]) => {
  return useQuery({
    queryKey,
    queryFn: () => fetchData(endpoint) as Promise<T>,
  });
};

// Example hook for posting data
export const useApiPost = <T, R>(endpoint: string, queryClient: QueryClient, invalidateQueries?: string[]) => {
  return useMutation({
    mutationFn: (data: T) => postData(endpoint, data) as Promise<R>,
    onSuccess: () => {
      // Invalidate queries to refetch data
      if (invalidateQueries) {
        invalidateQueries.forEach(query => {
          queryClient.invalidateQueries({ queryKey: [query] });
        });
      }
    }
  });
};

// Example of WebSocket connection template
export const createWebSocketConnection = (endpoint: string, handlers: {
  onMessage?: (data: any) => void,
  onOpen?: () => void,
  onClose?: () => void,
  onError?: (error: Event) => void
}) => {
  const SOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080';
  const socket = new WebSocket(`${SOCKET_URL}${endpoint}`);
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handlers.onMessage?.(data);
  };
  
  socket.onopen = () => {
    handlers.onOpen?.();
  };
  
  socket.onclose = () => {
    handlers.onClose?.();
  };
  
  socket.onerror = (error) => {
    handlers.onError?.(error);
  };
  
  return {
    send: (data: any) => {
      socket.send(JSON.stringify(data));
    },
    close: () => {
      socket.close();
    }
  };
};
