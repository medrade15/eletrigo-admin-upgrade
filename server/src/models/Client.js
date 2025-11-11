import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    joinDate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Client', ClientSchema);