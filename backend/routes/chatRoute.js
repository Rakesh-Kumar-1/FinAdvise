import express from 'express';
import { chat, chatrsidebar, getMessagesByRoom, sendMessage } from '../controllers/chat.js';

const router = express.Router();

router.post('/chatbot',chat);
// router.get('/chatroom/:id',chatrsidebar);
router.get('/chatroom',chatrsidebar)
router.get('/messages/:chatRoomId',getMessagesByRoom);
router.post("/messages", sendMessage);


export default router;

