import mongoose from 'mongoose';

// Define the schema for the user data
const l1HistorySchema = new mongoose.Schema({
  username: { type: String, required: true },
  userId: { type: String, required: true, unique: true }, // Added unique userId field
  history: { type: String, required: true },
  gurusTimeline: { type: String, required: true },
  specialDevelopments: { type: String, required: true },
  institutes: { type: String, required: true },
});

// Ensure the model is exported correctly, and check for existing models with the same name
export default mongoose.models.l1history || mongoose.model('l1history', l1HistorySchema);
