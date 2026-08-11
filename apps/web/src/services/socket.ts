import { io, Socket } from 'socket.io-client';
import { getAuthToken } from './api';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = getAuthToken();
    socket = io(window.location.origin, {
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
