const express = require('express');
const router = express.Router();

const bookingController = require('../Controllers/bookingController')


const { verifyUser, verifyAdmin } = require('../middleware/authMiddleware');

// POST endpoint to create a new booking request
router.post('/bookings',verifyUser, bookingController.createBooking);

// GET endpoint to retrieve all bookings for a specific user
router.get('/bookings/:userId', verifyUser, bookingController.getUserBookings);

// GET endpoint to retrieve all bookings
router.get('/getallbookings', verifyAdmin, bookingController.getAllBookings);

// POST endpoint to approve a booking request   
router.post('/bookings/:id/approve', verifyAdmin, bookingController.approveBooking);

// POST endpoint to decline a booking request
router.post('/bookings/:id/decline', verifyAdmin, bookingController.declineBooking);

// PUT endpoint to modify a booking request
router.put('/bookings/:id', verifyUser, bookingController.updateBooking);

  // POST endpoint to cancel a booking request
router.post('/bookings/:id/cancel', verifyUser, bookingController.cancelBooking);

  

module.exports = router;
