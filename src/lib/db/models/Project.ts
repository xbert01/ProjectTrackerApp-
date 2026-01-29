import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  ownerId: string;
  clientName: string;
  description: string;
  links: {
    sow?: string;
    usabilityGuidelines?: string;
    githubRepository?: string;
    figma?: string;
    feedbackSpreadsheet?: string;
  };
  status: 'active' | 'paused' | 'completed';
  endDate?: string;
  createdAt: string;
  completedAt?: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    ownerId: { type: String, required: true },
    clientName: { type: String, required: true },
    description: { type: String, default: '' },
    links: {
      sow: { type: String },
      usabilityGuidelines: { type: String },
      githubRepository: { type: String },
      figma: { type: String },
      feedbackSpreadsheet: { type: String },
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'completed'],
      default: 'active'
    },
    endDate: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
    completedAt: { type: String },
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

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
