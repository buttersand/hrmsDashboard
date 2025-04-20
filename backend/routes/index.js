import express from 'express';
import authRoutes from './authRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import leaveRoutes from './leaveRoutes.js';
import candidateRoutes from './candidateRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/leaves', leaveRoutes);
router.use('/candidates', candidateRoutes);
router.use('/attendance', attendanceRoutes);


export default router;
