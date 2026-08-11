import mongoose, { Schema, Document } from 'mongoose';

export interface IStoryDocument extends Document {
  author: mongoose.Types.ObjectId;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  caption?: string;
  viewsCount: number;
  expiresAt: Date;
  createdAt: Date;
}

const StorySchema = new Schema<IStoryDocument>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['IMAGE', 'VIDEO'],
      default: 'IMAGE',
    },
    caption: {
      type: String,
      default: '',
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index to automatically remove stories after 24 hours
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Story = mongoose.model<IStoryDocument>('Story', StorySchema);
