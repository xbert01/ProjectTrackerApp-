import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote extends Document {
  _id: string;
  projectId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const NoteSchema = new Schema<INote>(
  {
    projectId: { type: String, required: true, index: true },
    content: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
