import express from 'express';
import { index, show } from '../controllers/invoicesController.js';
// import { store } from '../controllers/invoicesController.js';
import validateParams from '../middlewares/validateParams.js';

const router = express.Router();

router.get('/', index);
router.get('/:id', validateParams, show);
//router.post('/', store);

export default router;