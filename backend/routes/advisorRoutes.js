import express from 'express'
import { bookdschedule, complainForm, clientbill, schedule } from '../controllers/user_identify.js';

const router = express.Router();

router.post('/complainForm',complainForm)
router.post('/schedule',schedule);
router.post('/clientbill',clientbill);
router.get('/bookdschedule', bookdschedule);



export default router;