import 'reflect-metadata';
import app from './app';
import { createServer } from 'http';
import { initSocket } from './socket';
import { DataSource } from 'typeorm';
import ormconfig from '../ormconfig';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 4000;

const server = createServer(app);

// Initialize Socket.IO (see src/socket/index.ts)
initSocket(server);

server.listen(PORT, () => {
  console.log(Backend listening on port ${PORT});
});