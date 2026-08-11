import mongoose, { Schema, Document } from 'mongoose';

export interface ILikeDocument extends Document {
  user: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetType: 'POST' | 'COMMENT';
  createdAt: Date;
}

const LikeSchema = new Schema<ILikeDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['POST', 'COMMENT'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

LikeSchema.index({ user: 1, targetId: 1, targetType: 1 }, { unique: true });

export const Like = mongoose.model<ILikeDocument>('Like', LikeSchema);
