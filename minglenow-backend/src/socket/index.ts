import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { Message } from '../entities/Message';

let io: Server;
export function initSocket(server: HTTPServer) {
  io = new Server(server, { cors: { origin: '*' } });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Auth error'));
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      (socket as any).userId = payload.userId;
      return next();
    } catch (err) {
      return next(new Error('Auth error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as any).userId;
    socket.join(user:${userId});

    socket.on('join_match', (matchId: string) => {
      socket.join(match:${matchId});
    });

    socket.on('send_message', async (data: any) => {
      // data: { matchId, content, metadata }
      const repo = getRepository(Message);
      const message = new Message();
      message.match_id = data.matchId;
      message.sender = userId;
      message.content = data.content;
      message.metadata = data.metadata || {};
      await repo.save(message);

      io.to(match:${data.matchId}).emit('message', message);
    });

    socket.on('typing', (data: any) => {
      io.to(match:${data.matchId}).emit('typing', { userId });
    });
  });
}