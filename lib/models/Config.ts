import mongoose, { Schema, Document } from 'mongoose';

export interface IConfig extends Document {
  clave: string;
  valor: string;
}

const ConfigSchema = new Schema<IConfig>(
  {
    clave: { type: String, required: true, unique: true },
    valor: { type: String, default: '' },
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

export const Config = mongoose.models.Config || mongoose.model<IConfig>('Config', ConfigSchema);
