import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationDocument extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type:
    | 'LIKE'
    | 'COMMENT'
    | 'FOLLOW'
    | 'FOLLOW_REQUEST'
    | 'FOLLOW_ACCEPT'
    | 'MENTION'
    | 'STORY_REACTION'
    | 'STORY_REPLY'
    | 'MESSAGE';
  post?: mongoose.Types.ObjectId;
  story?: mongoose.Types.ObjectId;
  comment?: mongoose.Types.ObjectId;
  text?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'LIKE',
        'COMMENT',
        'FOLLOW',
        'FOLLOW_REQUEST',
        'FOLLOW_ACCEPT',
        'MENTION',
        'STORY_REACTION',
        'STORY_REPLY',
        'MESSAGE',
      ],
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
    story: {
      type: Schema.Types.ObjectId,
      ref: 'Story',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    text: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

NotificationSchema.index({ recipient: 1, createdAt: -1 });

export const Notification = mongoose.model<INotificationDocument>('Notification', NotificationSchema);
