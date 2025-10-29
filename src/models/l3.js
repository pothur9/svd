import mongoose from 'mongoose';

// Define the schema for L3User
const l3UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  dob: { type: Date, required: false },
  gender: { type: String, required: false },
  contactNo: { type: String, required: true },
  mailId: { type: String, required: false },
  karthruGuru: { type: String, required: true },
  peeta: { type: String, required: true },
  bhage: { type: String, required: false },
  gothra: { type: String, required: false },
  nationality: { type: String, required: false },
  presentAddress: { type: String, required: false },
  permanentAddress: { type: String, required: false },
  qualification: { type: String, required: false },
  occupation: { type: String, required: false },
  languageKnown: { type: String, required: false },
  password:{ type: String, required: false },
  firebaseUid: { type: String, required: false },
  photoUrl:{ type: String, required: false },
  selectedL2User:{ type: String, required: false },
  kula: { type: String },
  married: { type: String },
  higherDegree: { type: String },
  maneDhevaruName: { type: String },
  maneDhevaruAddress: { type: String },
  subKula: { type: String },
  sonOf: { type: String },
});

export default mongoose.models.l3User || mongoose.model('l3User', l3UserSchema);
