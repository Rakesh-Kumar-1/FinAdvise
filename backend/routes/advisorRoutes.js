import express from 'express'
import { bookdschedule, complainForm, new_schedule, schedule } from '../controllers/user_identify.js';

const router = express.Router();

router.post('/complainForm',complainForm)
router.post('/schedule',schedule);
router.post('/new_schedule',new_schedule);
router.post('/bookdschedule',bookdschedule)


export default router;