import express from 'express';
import { index, show, store } from '../controllers/invoicesController.js';

const router = express.Router();

router.get('/', index);
router.get('/:id', show);
router.post('/', store);

export default router;