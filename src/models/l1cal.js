import mongoose from 'mongoose';

const l1calSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  username: {
    type: String,
    required: true },
});

export default mongoose.models.l1cal || mongoose.model('l1cal', l1calSchema);

