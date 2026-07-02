import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  url: string;
  descripcion: string;
  tipo: 'foto' | 'video';
  subido_por: string;
  aprobado: boolean;
}

const GallerySchema = new Schema<IGallery>(
  {
    url: { type: String, required: true },
    descripcion: { type: String, default: '' },
    tipo: {
      type: String,
      enum: ['foto', 'video'],
      default: 'foto',
    },
    subido_por: { type: String, default: 'invitado' },
    aprobado: { type: Boolean, default: false },
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

export const Gallery = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
