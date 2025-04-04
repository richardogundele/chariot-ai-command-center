
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type RealtimeConfig = {
  endpoint: string;
  queryKey: string[];
  onMessage?: (data: any) => void;
};

// This is a template showing how to integrate WebSockets with React Query
export const useRealtime = (config: RealtimeConfig) => {
  const { endpoint, queryKey, onMessage } = config;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Create WebSocket connection
    const SOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080';
    const ws = new WebSocket(`${SOCKET_URL}${endpoint}`);
    
    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
    };
    
    ws.onclose = () => {
      setIsConnected(false);
    };
    
    ws.onerror = (event) => {
      setError('WebSocket connection error');
      setIsConnected(false);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Call the optional onMessage handler
      if (onMessage) {
        onMessage(data);
      }
      
      // Update React Query cache with new data
      queryClient.setQueryData(queryKey, (oldData: any) => {
        // Logic to update the cache based on the WebSocket data
        // This is just an example and should be customized based on the data structure
        if (Array.isArray(oldData)) {
          // If it's an array, we might want to append, update or remove an item
          return [...oldData, data];
        }
        
        // If it's an object, we might want to merge the new data
        return { ...oldData, ...data };
      });
    };
    
    setSocket(ws);
    
    // Cleanup function
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [endpoint, queryKey]);
  
  // Function to send messages through the WebSocket
  const sendMessage = (data: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(data));
      return true;
    }
    return false;
  };
  
  return {
    isConnected,
    error,
    sendMessage
  };
};

// Example usage:
/*
const { isConnected, error, sendMessage } = useRealtime({
  endpoint: '/ws/alerts',
  queryKey: ['alerts'],
  onMessage: (data) => {
    console.log('New alert received:', data);
    // Show a notification or update UI
  }
});
*/
