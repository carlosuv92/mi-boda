import mongoose, { Schema, Document } from 'mongoose';

export interface ITimeline extends Document {
  hora: string;
  titulo: string;
  descripcion: string;
  icono: string;
}

const TimelineSchema = new Schema<ITimeline>(
  {
    hora: { type: String, required: true },
    titulo: { type: String, required: true },
    descripcion: { type: String, default: '' },
    icono: { type: String, default: '' },
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

export const Timeline = mongoose.models.Timeline || mongoose.model<ITimeline>('Timeline', TimelineSchema);
