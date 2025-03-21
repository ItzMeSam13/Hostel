import express from 'express';
import bookingroutes from './BookingRoutes.js';
import roomroutes from './RoomsRoutes.js';
import { protectRoute } from '../middlewares/authmiddleware.js';

const router = express.Router();

router.use('/bookings', protectRoute,bookingroutes);
router.use('/rooms', protectRoute,roomroutes);

export default router;
