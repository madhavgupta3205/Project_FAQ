import express from 'express';
import { registerAdmin, loginAdmin } from '../controllers/adminController.js';



router.post('/login', loginAdmin);

export default router;