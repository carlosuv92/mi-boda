import mongoose, { Schema, Document } from 'mongoose';

export interface IRSVP extends Document {
  guest_id: string;
  estado: 'ACEPTADO' | 'RECHAZADO' | 'PENDIENTE';
  acompanantes_confirmados: number;
  acompanantes_nombres: string[];
  total_confirmados: number;
  fecha: string;
  comentario: string;
}

const RSVPSchema = new Schema<IRSVP>(
  {
    guest_id: { type: String, required: true, unique: true },
    estado: {
      type: String,
      enum: ['ACEPTADO', 'RECHAZADO', 'PENDIENTE'],
      default: 'PENDIENTE',
    },
    acompanantes_confirmados: { type: Number, default: 0 },
    acompanantes_nombres: { type: [String], default: [] },
    total_confirmados: { type: Number, default: 1 },
    fecha: { type: String, default: '' },
    comentario: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: unknown, ret: Record<string, unknown>) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const RSVP = mongoose.models.RSVP || mongoose.model<IRSVP>('RSVP', RSVPSchema);
