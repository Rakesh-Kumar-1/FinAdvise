import express from 'express'
import { approveAdvisor, complain, complaintype, disapproveAdvisor, disapproveList, fecthactive, fecthinactive } from '../controllers/user_identify.js';

const router = express.Router();

router.post('/fetch-active',fecthactive)
router.post('/fetch-inactive',fecthinactive)
router.post('/complaintype',complaintype)
router.post('/complain',complain)
router.post('/approve/:id',approveAdvisor)
router.post('/reject/:id',disapproveAdvisor)
router.get('/disapprovelist',disapproveList);


export default router;