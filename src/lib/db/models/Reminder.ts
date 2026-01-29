import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReminder extends Document {
  projectId?: string;
  taskId?: string;
  message: string;
  triggerDate: string;
  isRead: boolean;
  createdAt: string;
}

const ReminderSchema = new Schema<IReminder>(
  {
    projectId: { type: String, index: true },
    taskId: { type: String },
    message: { type: String, required: true },
    triggerDate: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: false,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Reminder: Model<IReminder> =
  mongoose.models.Reminder || mongoose.model<IReminder>('Reminder', ReminderSchema);
