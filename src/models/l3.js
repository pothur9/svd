import mongoose from 'mongoose';

// Define the schema for L2User
const l3UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  contactNo: { type: String, required: true },
  mailId: { type: String, required: true },
  karthruGuru: { type: String, required: true },
  peeta: { type: String, required: true },
  bhage: { type: String, required: true },
  gothra: { type: String, required: true },
  nationality: { type: String, required: true },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  qualification: { type: String, required: true },
  occupation: { type: String, required: true },
  languageKnown: { type: String, required: true },
  password:{ type: String, required: true },
  photoUrl:{ type: String, required: true },
  selectedL2User:{ type: String, required: true },
  fcmToken:{ type: String, required: true },
});

export default mongoose.models.l3User || mongoose.model('l3User', l3UserSchema);
