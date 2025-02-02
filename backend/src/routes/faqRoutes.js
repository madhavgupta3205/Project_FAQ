import express from 'express';
import { createFaq, getFaqs, updateFaq, deleteFaq } from '../controllers/faqController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getFaqs);
router.delete('/:id', auth, deleteFaq);

export default router;
