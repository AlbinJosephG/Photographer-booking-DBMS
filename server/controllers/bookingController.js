import Booking from '../models/Booking.js';

// 🔹 Create a booking
export const createBooking = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    console.log('🔔 Booking attempt by user:', req.user.id);
    console.log('📦 Request body:', req.body);

    const booking = await Booking.create({
      ...req.body,
      user: req.user.id // ✅ attach the user
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error('❌ Booking creation error:', err);
    res.status(400).json({ message: err.message });
  }
};

// 🔹 User's bookings
export const getUserBookings = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    const bookings = await Booking.find({ user: req.user.id }).sort({ date: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error('❌ Fetch user bookings error:', err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Admin: All bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ date: -1 })
      .populate('user', 'username'); // show who booked
    res.json(bookings);
  } catch (err) {
    console.error('❌ Fetch all bookings error:', err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Admin: Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    console.error('❌ Update booking status error:', err);
    res.status(500).json({ message: err.message });
  }
};


