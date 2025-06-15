import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  sessionType: String,
  location: String,
  date: Date,
  time: String,
  status: { type: String, default: 'pending' },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // ✅ ensures it must be present
  },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
