
import express from 'express';
import { createFaq, getFaqs, updateFaq, deleteFaq } from '../controllers/faqController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/', getFaqs);

// Protected routes
router.post('/', auth, createFaq);
router.put('/:id', auth, updateFaq);
router.delete('/:id', auth, deleteFaq);

export default router;
