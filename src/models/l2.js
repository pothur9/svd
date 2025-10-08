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
  // Optional profile fields
  dob: { type: Date, required: false },
  address: { type: String, required: false },
  dhekshaGuru: { type: String, required: false },
  karthruGuru: { type: String, required: false },
  gender: { type: String, required: false },
  bhage: { type: String, required: false },
  gothra: { type: String, required: false },
  mariPresent: { type: String, required: false },
  paramapare: { type: String, required: false },
  parampare: { type: String, required: false },
  imageUrl: { type: String, required: false },
  peetarohanaDate: { type: Date, required: false },
});

export default mongoose.models.l2User || mongoose.model('l2User', l2UserSchema);
