import express from 'express';
import { index, show, getProducts } from '../controllers/categoriesController.js';

const router = express.Router();

router.get('/', index);
router.get('/:name', show);
router.get('/:name/products', getProducts);

export default router;