import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageDocument extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text?: string;
  mediaUrl?: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE' | 'GIF' | 'POST_SHARE' | 'PROFILE_SHARE' | 'LOCATION';
  sharedPost?: mongoose.Types.ObjectId;
  sharedProfile?: mongoose.Types.ObjectId;
  replyToMessage?: mongoose.Types.ObjectId;
  reactions: Array<{ user: mongoose.Types.ObjectId; emoji: string }>;
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    mediaUrl: {
      type: String,
    },
    type: {
      type: String,
      enum: ['TEXT', 'IMAGE', 'VIDEO', 'VOICE', 'GIF', 'POST_SHARE', 'PROFILE_SHARE', 'LOCATION'],
      default: 'TEXT',
    },
    sharedPost: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    sharedProfile: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    replyToMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    reactions: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        emoji: { type: String },
      },
    ],
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
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

MessageSchema.index({ conversation: 1, createdAt: -1 });

export const Message = mongoose.model<IMessageDocument>('Message', MessageSchema);
