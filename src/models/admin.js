
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phnumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// If the model already exists, prevent it from being compiled again
export default mongoose.models.admin || mongoose.model('admin', adminSchema);