import mongoose, { Schema, Document } from 'mongoose';

export interface ICollectionDocument extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  coverUrl?: string;
  posts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollectionDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    coverUrl: {
      type: String,
      default: '',
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
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

CollectionSchema.index({ user: 1, name: 1 });

export const Collection = mongoose.model<ICollectionDocument>('Collection', CollectionSchema);
