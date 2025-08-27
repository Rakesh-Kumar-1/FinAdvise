import express from 'express'
import { approveAdvisor, complain, complaintype, disapproveAdvisor, disapproveList, fecthactive, fecthinactive, transactionManager } from '../controllers/user_identify.js';

const router = express.Router();

router.get('/fetch-active',fecthactive)
router.get('/fetch-inactive',fecthinactive)
router.get('/complaintype/:name',complaintype)
router.post('/complain',complain)
router.post('/approve/:id',approveAdvisor)
router.post('/reject/:id',disapproveAdvisor)
router.get('/disapprovelist',disapproveList);
router.get('/transaction',transactionManager);

export default router;