import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

const onlineUsers = new Map<string, string>(); // userId -> socketId

export const setupSocketHandlers = (io: Server) => {
  // Socket auth middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        return next(new Error('Authentication token missing'));
      }
      const secret = process.env.JWT_SECRET || 'super_secret_boundup_jwt_access_key_2026_change_in_production';
      const decoded = jwt.verify(token, secret) as { id: string };

      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId;
    if (!userId) return;

    // Join user's personal notification room
    socket.join(`user:${userId}`);
    onlineUsers.set(userId, socket.id);

    // Broadcast online status to all
    io.emit('user:online', { userId });

    // Join specific conversation room
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Typing status events
    socket.on('typing:start', ({ conversationId, username }: { conversationId: string; username: string }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:start', { conversationId, userId, username });
    });

    socket.on('typing:stop', ({ conversationId }: { conversationId: string }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:stop', { conversationId, userId });
    });

    // Vanish Mode socket event
    socket.on('chat:vanish_toggle', ({ conversationId, isVanishMode }: { conversationId: string; isVanishMode: boolean }) => {
      io.to(`conversation:${conversationId}`).emit('chat:vanish_toggle', { conversationId, isVanishMode });
    });

    // Live Stream / Spaces Socket Events
    socket.on('live:join', ({ roomId, username, avatarUrl }: { roomId: string; username: string; avatarUrl?: string }) => {
      socket.join(`live:${roomId}`);
      io.to(`live:${roomId}`).emit('live:user_joined', { userId, username, avatarUrl, timestamp: new Date() });
    });

    socket.on('live:leave', ({ roomId, username }: { roomId: string; username: string }) => {
      socket.leave(`live:${roomId}`);
      io.to(`live:${roomId}`).emit('live:user_left', { userId, username });
    });

    socket.on('live:chat', ({ roomId, message, username, avatarUrl }: { roomId: string; message: string; username: string; avatarUrl?: string }) => {
      io.to(`live:${roomId}`).emit('live:chat', {
        id: Date.now().toString(),
        userId,
        username,
        avatarUrl,
        message,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('live:reaction', ({ roomId, emoji }: { roomId: string; emoji: string }) => {
      io.to(`live:${roomId}`).emit('live:reaction', { userId, emoji, id: Math.random().toString() });
    });

    socket.on('disconnect', () => {
      if (userId) {
        onlineUsers.delete(userId);
        io.emit('user:offline', { userId });
      }
    });
  });
};

export const getOnlineUsers = () => Array.from(onlineUsers.keys());
