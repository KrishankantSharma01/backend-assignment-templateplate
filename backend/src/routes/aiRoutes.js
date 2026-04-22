import express from 'express';
import { generateStudyPlan  } from '../controllers/aiController.js';

const router = express.Router();

router.post("/study-plan", generateStudyPlan);

export default router;
