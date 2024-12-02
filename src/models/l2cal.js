import mongoose from 'mongoose';

const l2calSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true, // Username is required to associate event with a user
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

export default mongoose.models.l2cal || mongoose.model('l2cal', l2calSchema);
