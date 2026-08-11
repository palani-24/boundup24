import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedPostDocument extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  collectionName: string;
  createdAt: Date;
}

const SavedPostSchema = new Schema<ISavedPostDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    collectionName: {
      type: String,
      default: 'All Posts',
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

SavedPostSchema.index({ user: 1, post: 1 }, { unique: true });

export const SavedPost = mongoose.model<ISavedPostDocument>('SavedPost', SavedPostSchema);
