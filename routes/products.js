import express from 'express';
import { index, show, showFive } from '../controllers/productsController.js';
import validateParams from '../middlewares/validateParams.js';

const router = express.Router();

router.get('/', index);
router.get('/initial', showFive);
router.get('/:slug', validateParams, show);


export default router;