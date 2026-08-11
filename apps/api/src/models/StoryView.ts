import mongoose, { Schema, Document } from 'mongoose';

export interface IStoryViewDocument extends Document {
  story: mongoose.Types.ObjectId;
  viewer: mongoose.Types.ObjectId;
  viewedAt: Date;
}

const StoryViewSchema = new Schema<IStoryViewDocument>(
  {
    story: {
      type: Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
      index: true,
    },
    viewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

StoryViewSchema.index({ story: 1, viewer: 1 }, { unique: true });

export const StoryView = mongoose.model<IStoryViewDocument>('StoryView', StoryViewSchema);
