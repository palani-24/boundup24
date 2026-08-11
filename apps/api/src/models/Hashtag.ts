import mongoose, { Schema, Document } from 'mongoose';

export interface IHashtagDocument extends Document {
  name: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const HashtagSchema = new Schema<IHashtagDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    postCount: {
      type: Number,
      default: 1,
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

export const Hashtag = mongoose.model<IHashtagDocument>('Hashtag', HashtagSchema);
