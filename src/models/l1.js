// models/User.js
import mongoose from 'mongoose';

const l1UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  contactNo: { type: String, required: true },
  peetarohanaDate: { type: Date, required: true },
  gender: { type: String, required: true },
  karthruGuru: { type: String, required: true },
  dhekshaGuru: { type: String, required: true },
  peeta: { type: String, required: true },
  bhage: { type: String, required: true },
  gothra: { type: String, required: true },
  mariPresent: { type: String,  },
  password:{ type: String, required: true },
  imageUrl:{ type: String, required: true },
  address:{ type: String, required: true },
});

export default mongoose.models.l1User || mongoose.model('l1User', l1UserSchema);
