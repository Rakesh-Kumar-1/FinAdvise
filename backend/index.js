import express from 'express';
import connectDB from './db/connectDB.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoute from './routes/userRoutes.js';
import adminRoute from './routes/adminRoutes.js';
import managerRoute from './routes/managerRoutes.js';
import advisorRoute from './routes/advisorRoutes.js';
import {fileURLToPath} from 'url';
import { chat } from './routes/chat.js';
import {records} from './routes/records.js'
import path from 'path';

dotenv.config({});
connectDB();

const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
import './middleware/restoreSlots.js'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/files', express.static(path.join(__dirname, 'files')));

// Routes
app.use('/user', userRoute);
app.use('/admin',adminRoute );
app.use('/manager',managerRoute);
app.use('/advisor',advisorRoute);
app.use('/chat', chat)
app.use('/payment/records',records);

// 🧠 Wrap startup logic
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
