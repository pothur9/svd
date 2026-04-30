import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema(
  {
    fromUserId: { type: String, required: false, default: 'SYSTEM' },
    toUserId:   { type: String, required: true },
    fromName:   { type: String, required: false, default: 'System' },
    toName:     { type: String, required: false },
    amount:     { type: Number, required: true },
    // 'signup_bonus' | 'transfer' | 'admin_credit'
    type:       { type: String, required: true, default: 'transfer' },
    note:       { type: String, required: false },
    // which level the toUser belongs to: 'l2' | 'l3' | 'l4'
    userLevel:  { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.WalletTransaction ||
  mongoose.model('WalletTransaction', walletTransactionSchema);
