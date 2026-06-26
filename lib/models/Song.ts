import mongoose, { Schema, Document } from 'mongoose';

export interface ISong extends Document {
  guest_id: string;
  guest_name: string;
  cancion: string;
  artista: string;
  comentario: string;
}

const SongSchema = new Schema<ISong>(
  {
    guest_id: { type: String, required: true },
    guest_name: { type: String, default: '' },
    cancion: { type: String, required: true },
    artista: { type: String, required: true },
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

export const Song = mongoose.models.Song || mongoose.model<ISong>('Song', SongSchema);
