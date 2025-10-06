// models/User.js
import mongoose from 'mongoose';

const l2UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  contactNo: { type: String, required: true },
  peeta: { type: String, required: true },
  mataName: { type: String, required: true },
  password: { type: String, required: false },
  firebaseUid: { type: String, required: false },
});

export default mongoose.models.l2User || mongoose.model('l2User', l2UserSchema);
