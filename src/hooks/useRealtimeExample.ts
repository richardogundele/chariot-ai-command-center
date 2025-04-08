
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type RealtimeConfig = {
  endpoint: string;
  queryKey: string[];
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

/**
 * A hook to integrate WebSockets with React Query for realtime data
 * Simplified and improved for easier integration
 */
export const useRealtime = (config: RealtimeConfig) => {
  const { endpoint, queryKey, onMessage, onConnect, onDisconnect } = config;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    try {
      // Create WebSocket connection
      const SOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080';
      const ws = new WebSocket(`${SOCKET_URL}${endpoint}`);
      
      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        onConnect?.();
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        onDisconnect?.();
      };
      
      ws.onerror = () => {
        setError('Connection error. Please check your network or try again.');
        setIsConnected(false);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Call the optional onMessage handler
          onMessage?.(data);
          
          // Update React Query cache with new data
          queryClient.setQueryData(queryKey, (oldData: any) => {
            if (!oldData) return data;
            
            // Handle array data (like lists)
            if (Array.isArray(oldData)) {
              // If the data has an ID field, update or add the item
              if (data.id) {
                const existingIndex = oldData.findIndex(item => item.id === data.id);
                if (existingIndex >= 0) {
                  const newArray = [...oldData];
                  newArray[existingIndex] = { ...newArray[existingIndex], ...data };
                  return newArray;
                } else {
                  return [...oldData, data];
                }
              } else {
                // Simple append if no ID
                return [...oldData, data];
              }
            }
            
            // Handle object data (like dashboards)
            return { ...oldData, ...data };
          });
        } catch (e) {
          console.error('Error processing WebSocket message:', e);
        }
      };
      
      setSocket(ws);
      
      // Cleanup function
      return () => {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      };
    } catch (err) {
      setError('Failed to establish connection');
      console.error('WebSocket connection error:', err);
    }
  }, [endpoint, queryKey, onMessage, onConnect, onDisconnect]);
  
  // Function to send messages through the WebSocket
  const sendMessage = useCallback((data: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, [socket, isConnected]);

  // Function to reconnect if connection drops
  const reconnect = useCallback(() => {
    if (socket) {
      socket.close();
    }
    // The useEffect will handle creating a new connection
  }, [socket]);
  
  return {
    isConnected,
    error,
    sendMessage,
    reconnect
  };
};

// Example usage documentation:
/*
// For realtime dashboard updates
const { isConnected, error, sendMessage } = useRealtime({
  endpoint: '/ws/dashboard',
  queryKey: ['dashboard'],
  onMessage: (data) => {
    // Optional: Show a notification when new data arrives
    toast({
      title: "Dashboard Updated",
      description: "New performance data is available"
    });
  }
});

// For realtime alerts
const { isConnected } = useRealtime({
  endpoint: '/ws/alerts',
  queryKey: ['alerts'],
  onMessage: (newAlert) => {
    // Show the new alert immediately
    toast({
      title: newAlert.title,
      description: newAlert.message,
      variant: newAlert.type
    });
  }
});
*/
