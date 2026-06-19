import express from 'express';
import { show } from '../controllers/usersController.js';

const router = express.Router();

router.get('/:id', show);

export default router;