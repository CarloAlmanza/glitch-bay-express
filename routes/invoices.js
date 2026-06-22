import express from 'express';
import { index, show, store } from '../controllers/invoicesController.js';
import validateParams from '../middlewares/validateParams.js';
import invoiceValidator from '../middlewares/invoiceValidator.js';

const router = express.Router();

router.get('/', index);
router.get('/:id', validateParams, show);
router.post('/', invoiceValidator, store);

export default router;