import express from 'express';
import { index, show, showFive } from '../controllers/productsController.js';
import validateIdSlug from '../middlewares/idSlugValidation.js';

const router = express.Router();

router.get('/', index);
router.get('/initial', showFive);
router.get('/:slug', validateIdSlug, show);


export default router;