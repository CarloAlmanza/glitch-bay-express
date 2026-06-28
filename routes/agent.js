import express from 'express';
import { index } from '../controllers/agentController.js';
import queryValidationClaude from '../middlewares/queryValidationClaude.js';

const router = express.Router();

router.get('/', queryValidationClaude, index);

export default router;