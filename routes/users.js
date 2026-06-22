import express from 'express';
import { show } from '../controllers/usersController.js';
import validateIdSlug from '../middlewares/validateParams.js';

const router = express.Router();

router.get('/:id', validateIdSlug, show);

export default router;