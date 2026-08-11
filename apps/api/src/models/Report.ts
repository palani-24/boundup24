import mongoose, { Schema, Document } from 'mongoose';

export interface IReportDocument extends Document {
  reporter: mongoose.Types.ObjectId;
  targetType: 'POST' | 'USER' | 'COMMENT';
  targetId: mongoose.Types.ObjectId;
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: Date;
}

const ReportSchema = new Schema<IReportDocument>(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['POST', 'USER', 'COMMENT'],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'RESOLVED', 'DISMISSED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Report = mongoose.model<IReportDocument>('Report', ReportSchema);
