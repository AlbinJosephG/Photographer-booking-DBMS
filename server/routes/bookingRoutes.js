import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus
} from '../controllers/bookingController.js';

import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', authenticateUser, createBooking);
router.get('/my', authenticateUser, getUserBookings);

// Admin routes
router.get('/all', authenticateUser, requireAdmin, getAllBookings);
router.put('/:id/status', authenticateUser, requireAdmin, updateBookingStatus);

export default router;



