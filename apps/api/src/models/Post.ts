import mongoose, { Schema, Document } from 'mongoose';

export interface IPostDocument extends Document {
  author: mongoose.Types.ObjectId;
  media: Array<{
    url: string;
    type: 'IMAGE' | 'VIDEO' | 'AUDIO';
    aspectRatio: '1:1' | '4:5' | '16:9' | '9:16';
    thumbnailUrl?: string;
  }>;
  type: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'TEXT' | 'AUDIO';
  caption: string;
  hashtags: string[];
  location?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isCommentsDisabled: boolean;
  isLikeCountHidden: boolean;
  visibility: 'PUBLIC' | 'CLOSE_FRIENDS';
  poll?: {
    question: string;
    options: Array<{
      _id?: mongoose.Types.ObjectId;
      id?: string;
      text: string;
      votes: mongoose.Types.ObjectId[];
    }>;
  };
  audioUrl?: string;
  community?: mongoose.Types.ObjectId;
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
        type: { type: String, enum: ['IMAGE', 'VIDEO', 'AUDIO'], required: true },
        aspectRatio: { type: String, enum: ['1:1', '4:5', '16:9', '9:16'], default: '1:1' },
        thumbnailUrl: { type: String },
      },
    ],
    type: {
      type: String,
      enum: ['IMAGE', 'VIDEO', 'CAROUSEL', 'TEXT', 'AUDIO'],
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
    visibility: {
      type: String,
      enum: ['PUBLIC', 'CLOSE_FRIENDS'],
      default: 'PUBLIC',
    },
    poll: {
      question: { type: String },
      options: [
        {
          text: { type: String, required: true },
          votes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        },
      ],
    },
    audioUrl: {
      type: String,
      default: '',
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: 'Community',
      default: null,
      index: true,
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
