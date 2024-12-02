// models/UserData.js
import mongoose from 'mongoose';

const l2HistorySchema = new mongoose.Schema({
  username: { type: String, required: true },
  history: { type: String, required: true },
  gurusTimeline: { type: String, required: true },
  specialDevelopments: { type: String, required: true },
  institutes: {type: String, required: true },
});

export default mongoose.models.l2history || mongoose.model('l2history', l2HistorySchema);