import mongoose, { Schema, Document } from 'mongoose';

export interface IGuest extends Document {
  slug: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  acompanantes_autorizados: number;
  estado: 'pendiente' | 'confirmado' | 'rechazado';
}

const GuestSchema = new Schema<IGuest>(
  {
    slug: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    telefono: { type: String, default: '' },
    email: { type: String, default: '' },
    acompanantes_autorizados: { type: Number, default: 0 },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmado', 'rechazado'],
      default: 'pendiente',
    },
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

export const Guest = mongoose.models.Guest || mongoose.model<IGuest>('Guest', GuestSchema);
