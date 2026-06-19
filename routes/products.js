import express from 'express';
import { index, show } from '../controllers/productsController.js';

const router = express.Router();

router.get('/', index);
router.get('/:slug', show);

export default router;