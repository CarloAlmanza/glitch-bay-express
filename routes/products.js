import express from 'express';
import { index, show, showFive, showTopSeller } from '../controllers/productsController.js';
import validateParams from '../middlewares/validateParams.js';
import categoryCheck from '../middlewares/categoryCheck.js';

const router = express.Router();

router.get('/', categoryCheck,index);
router.get('/initial', showFive);
router.get('/topseller', showTopSeller);
router.get('/:slug', validateParams, show);


export default router;