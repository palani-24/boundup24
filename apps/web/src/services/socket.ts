import { io, Socket } from 'socket.io-client';
import { getAuthToken } from './api';

// Use VITE_API_URL for socket connection (separate backend domain in production)
const SOCKET_URL = (import.meta as any).env?.VITE_API_URL
  ? (import.meta as any).env.VITE_API_URL.replace('/api', '')
  : window.location.origin;

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = getAuthToken();
    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const token = getAuthToken();
  if (!token) return;
  const s = getSocket();
  if (!s.connected) {
    s.auth = { token };
    s.connect();
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
