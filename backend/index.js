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
    origin: ['http://localhost:5173','https://finadvise-frontend.onrender.com'], // Frontend origin
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Global socket handler (basic)
const connectedUsers = new Map(); // key = userId, value = socket.id

io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  // 1️⃣ Identify user on connect
  socket.on('identify', ({ userId }) => {
    connectedUsers.set(userId, socket.id);
    console.log(`✅ User ${userId} identified with socket ${socket.id}`);
  });

  // 2️⃣ Join chat room after verifying participation
  socket.on('join_room', async ({ chatRoomId, userId }) => {
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) return;

    const isParticipant =
      chatRoom.clientId.toString() === userId ||
      chatRoom.advisorId.toString() === userId;

    if (isParticipant) {
      socket.join(chatRoomId);
      console.log(`📥 User ${userId} joined room ${chatRoomId}`);
    } else {
      console.warn(`🚫 Unauthorized join attempt by user ${userId} to room ${chatRoomId}`);
    }
  });

  // 3️⃣ Send message (receiver may or may not be online)
  socket.on('send_message', (message) => {
    const { chatRoomId, receiverId } = message;

    // Emit to room for real-time update
    io.to(chatRoomId).emit('receiveMessage', message);

    // If receiver is online (for future notification use)
    const receiverSocket = connectedUsers.get(receiverId);
    if (receiverSocket) {
      console.log(`📡 Message delivered to receiver ${receiverId}`);
    } else {
      console.log(`📭 Receiver ${receiverId} offline. Message stored in DB.`);
      // 🔔 Optionally trigger push/email/notification
    }
  });

  // 4️⃣ Cleanup on disconnect
  socket.on('disconnect', () => {
    for (let [userId, sockId] of connectedUsers.entries()) {
      if (sockId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`🔴 User ${userId} disconnected`);
        break;
      }
    }
  });
});


// Middleware
import './middleware/restoreSlots.js';
import { ChatRoom } from './models/chatroom.js';
import { errorHandling } from './middleware/errorHandling.js';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173','https://finadvise-frontend.onrender.com'],
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
app.use(errorHandling)

// Start HTTP + WebSocket server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
