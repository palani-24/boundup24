import mongoose, { Schema, Document } from 'mongoose';

export interface IFollowDocument extends Document {
  follower: mongoose.Types.ObjectId;
  following: mongoose.Types.ObjectId;
  status: 'ACCEPTED' | 'PENDING';
  createdAt: Date;
}

const FollowSchema = new Schema<IFollowDocument>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['ACCEPTED', 'PENDING'],
      default: 'ACCEPTED',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

export const Follow = mongoose.model<IFollowDocument>('Follow', FollowSchema);
