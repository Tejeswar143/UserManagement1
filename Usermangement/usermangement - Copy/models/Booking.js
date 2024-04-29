// backend/models/Booking.js

const mongoose = require('mongoose');
// const User = require('../models/User');  

const bookingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Declined','Cancelled'],
    default: 'Pending'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
