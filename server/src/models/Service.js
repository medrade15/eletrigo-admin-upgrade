import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ['client', 'electrician'], required: true },
    message: { type: String, required: true },
    timestamp: { type: String, required: true },
  },
  { _id: false }
);

const LocationSchema = new mongoose.Schema(
  {
    lat: Number,
    lon: Number,
  },
  { _id: false }
);

const ServiceSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    electricianId: { type: String },
    electricianName: { type: String },
    serviceType: { type: String, enum: ['Emergencial', 'Agendado'], required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['Solicitado', 'Aceito', 'Em Atendimento', 'Concluído', 'Cancelado'], required: true },
    date: { type: String, required: true },
    value: { type: Number, default: 0 },
    eta: { type: Number },
    cep: { type: String },
    referencePoint: { type: String },
    location: { type: LocationSchema },
    chat: { type: [ChatMessageSchema], default: [] },
    clientRating: { type: Number },
    electricianRating: { type: Number },
    serviceDescription: { type: String },
    serviceNotes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Service', ServiceSchema);