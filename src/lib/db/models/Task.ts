import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask extends Document {
  projectId?: string;
  ownerId: string;  // For tasks without project
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  calendarDate: string;
  createdAt: string;
}

const TaskSchema = new Schema<ITask>(
  {
    projectId: { type: String, index: true },  // Optional for general tasks
    ownerId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done'],
      default: 'todo'
    },
    calendarDate: { type: String, required: true },
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

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
