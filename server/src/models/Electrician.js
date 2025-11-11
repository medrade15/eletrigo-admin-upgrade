import mongoose from 'mongoose';

const ElectricianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cpf: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    profilePictureUrl: { type: String },
    documentUrl: { type: String },
    experience: { type: String },
    status: { type: String, enum: ['Aguardando Aprovação', 'Aprovado', 'Suspenso'], default: 'Aguardando Aprovação' },
    rating: { type: Number, default: 0 },
    joinDate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Electrician', ElectricianSchema);