import express from 'express';
import { index, show } from '../controllers/categoriesController.js';
// import { getProducts } from '../controllers/productsController.js';
import validateParams from '../middlewares/validateParams.js';

const router = express.Router();

router.get('/', index);
router.get('/:id', validateParams, show);
// router.get('/:name/products', getProducts);

export default router;