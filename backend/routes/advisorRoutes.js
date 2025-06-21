import express from 'express'
import { complainForm, schedule } from '../controllers/user_identify.js';

const router = express.Router();

router.post('/complainForm',complainForm)
router.post('/schedule',schedule);


export default router;