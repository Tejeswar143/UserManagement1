const { sendNotificationEmail, sendAdminNotification } = require('../utils/emailService');
const Booking = require('../models/Booking');
const Author = require('../models/User');


  // Logic for creating a booking by user
exports.createBooking = async (req, res) => {

  try {
    const { date, _id } = req.body;
    console.log(_id)
    const author = await Author.findById(_id);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    const newBooking = await Booking.create({ date, author: author._id });
    console.log(author.Email)
    // Send notification email to user
    await sendNotificationEmail(author.Email, 'Booking Created', 'Your booking request has been received and is pending for approval.');
    // Send notification email to admin
    await sendAdminNotification('New Booking Request', `A new booking request (ID: ${newBooking._id}) has been received from ${author.name}.`);
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

 // Logic for getting bookings for a specific user
exports.getUserBookings = async (req, res) => {
  try {
    // Retrieve the user ID from the request parameters
    const userId = req.params.userId;

    // Find all bookings associated with the specified user ID
    const bookings = await Booking.find({ author: userId });

    // Send the bookings as a response
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  // Logic for getting all bookings
  try {
    // Find all bookings in the database
    const bookings = await Booking.find();

    // Send the bookings as a response
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logic for approving a booking
exports.approveBooking = async (req, res) => {
  try {
    console.log("Request received to approve booking with ID:", req.params.id);

    // Find the booking by ID and update its status to 'Approved'
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true }).populate('author', 'name Email');

    // Check if the booking exists
    if (!booking) {
      console.log("Booking not found.");
      return res.status(404).json({ message: "Booking not found" });
    }

    // Log the updated booking
    console.log("Booking approved:", booking);

    // Send notification email to user
    await sendNotificationEmail(booking.author.Email, 'Booking Approved', `Your booking request (ID: ${booking._id}) has been approved.`);
    // Send notification email to admin
    await sendAdminNotification('Booking Approved', `Booking request (ID: ${booking._id}) from ${booking.author.name} has been approved.`);

    // Respond with the updated booking
    res.status(202).json(booking);
  } catch (err) {
    // Handle any errors
    console.error("Error approving booking:", err);
    res.status(500).json({ message: err.message });
  }
};

// Logic for declining a booking
exports.declineBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'Declined' }, { new: true }).populate('author', 'name email');
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    // Send notification email to user
    await sendNotificationEmail(booking.author.email, 'Booking Declined', `Your booking request (ID: ${booking._id}) has been declined.`);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logic for updating a booking
exports.updateBooking = async (req, res) => {
  try {
    //   const userId = req.user._id;
      const bookingId = req.params.id;
      const { date } = req.body;
  
      // Find the booking by ID
      const booking = await Booking.findById(bookingId).populate('author', 'name email');
  
      // Check if the booking exists
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      // Check if the status is pending
      if (booking.status !== 'Pending') {
        return res.status(400).json({ message: "Booking status is not pending" });
      }
  
      // Update booking details
      booking.date = date; // Update the date, you can add more fields to update as needed
  
      // Save the updated booking
      await booking.save();
        // Send notification email to user
        await sendNotificationEmail(booking.author.email, 'Booking Updated', `Your booking request (ID: ${booking._id}) has been updated.`);
  
      // Send response
      res.status(200).json({ message: "Booking updated successfully", booking });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

// Logic for cancelling a booking
exports.cancelBooking = async (req, res) => {
  try {
      const bookingId = req.params.id;
  
      // Find the booking by ID
      const booking = await Booking.findById(bookingId).populate('author', 'name email');
  
      // Check if the booking exists
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // Check if the status is pending
      if (booking.status !== 'Pending') {
        return res.status(400).json({ message: "Booking status is not pending" });
      }
  
      // Update the status to 'Cancelled'
      booking.status = 'Cancelled';
      await booking.save();
         // Send notification email to user
        await sendNotificationEmail(booking.author.email, 'Booking Cancelled', `Your booking request (ID: ${booking._id}) has been cancelled.`);
  
      // Send response
      res.status(200).json({ message: "Booking cancelled successfully", booking });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
