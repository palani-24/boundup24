import mongoose, { Schema, Document } from 'mongoose';

export interface IPostDocument extends Document {
  author: mongoose.Types.ObjectId;
  media: Array<{
    url: string;
    type: 'IMAGE' | 'VIDEO';
    aspectRatio: '1:1' | '4:5' | '16:9' | '9:16';
    thumbnailUrl?: string;
  }>;
  type: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'TEXT';
  caption: string;
  hashtags: string[];
  location?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isCommentsDisabled: boolean;
  isLikeCountHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPostDocument>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ['IMAGE', 'VIDEO'], required: true },
        aspectRatio: { type: String, enum: ['1:1', '4:5', '16:9', '9:16'], default: '1:1' },
        thumbnailUrl: { type: String },
      },
    ],
    type: {
      type: String,
      enum: ['IMAGE', 'VIDEO', 'CAROUSEL', 'TEXT'],
      default: 'IMAGE',
    },
    caption: {
      type: String,
      default: '',
      maxLength: 2200,
    },
    hashtags: [
      {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
      },
    ],
    location: {
      type: String,
      default: '',
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
    isCommentsDisabled: {
      type: Boolean,
      default: false,
    },
    isLikeCountHidden: {
      type: Boolean,
      default: false,
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

PostSchema.index({ createdAt: -1 });
PostSchema.index({ author: 1, createdAt: -1 });

export const Post = mongoose.model<IPostDocument>('Post', PostSchema);
