import express from 'express';
import { chat, chatsidebar, getMessagesByRoom, sendMessage } from '../controllers/chat.js';

const router = express.Router();

router.post('/chatbot',chat);
// router.get('/chatroom/:id',chatrsidebar);
router.get('/chatroom',chatsidebar)
router.get('/messages/:chatRoomId',getMessagesByRoom);
router.post("/sendmessages", sendMessage);

// Route to get all rooms for a user
// router.get("/room/:userId", getUserRooms);


export default router;

