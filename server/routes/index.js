import express from 'express';
import authRoutes from './auth.routes.js';
import clientRoutes from './client.routes.js';

const router = express.Router();

// Rotas da API
router.use('/clients', clientRoutes);
router.use('/auth', authRoutes);

export default router;