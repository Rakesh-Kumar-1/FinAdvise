import express from 'express';
import http from 'http'; // ⬅️ For creating server
import { Server as SocketIOServer } from 'socket.io'; // ⬅️ Socket.IO
import connectDB from './db/connectDB.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/userRoutes.js';
import adminRoute from './routes/adminRoutes.js';
import managerRoute from './routes/managerRoutes.js';
import advisorRoute from './routes/advisorRoutes.js';
import chatRoutes from './routes/chatRoute.js';
import { fileURLToPath } from 'url';
import { records } from './routes/records.js';
import path from 'path';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 8080;
const app = express();

// Socket setup
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Global socket handler (basic)
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

 socket.on('join_room', (roomId) => {
  socket.join(roomId);
  console.log(`Socket ${socket.id} joined room ${roomId}`);
});
  // Receiving message
socket.on('send_message', (message) => {
  io.to(message.chatRoomId).emit('receiveMessage', message);
});

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Middleware
import './middleware/restoreSlots.js';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/files', express.static(path.join(__dirname, 'files')));

// Routes
app.use('/user', userRoute);
app.use('/admin', adminRoute);
app.use('/manager', managerRoute);
app.use('/advisor', advisorRoute);
app.use('/chat', chatRoutes);
app.use('/payment/records', records);

// Start HTTP + WebSocket server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
