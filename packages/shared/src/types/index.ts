export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
}

export interface IUser {
  id: string;
  _id?: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  website?: string;
  category?: string;
  isPrivate: boolean;
  isVerified: boolean;
  role: UserRole;
  status: AccountStatus;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  dob?: string;
  badges?: string[];
  closeFriends?: string[];
  createdAt: string;
  updatedAt: string;
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '4:5',
  LANDSCAPE = '16:9',
  STORY = '9:16',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
}

export interface IMediaItem {
  url: string;
  type: MediaType;
  aspectRatio: AspectRatio;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export enum PostType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  CAROUSEL = 'CAROUSEL',
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
}

export interface IPollOption {
  id: string;
  text: string;
  votes: string[]; // User IDs who voted for this option
}

export interface IPoll {
  id: string;
  question: string;
  options: IPollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
}

export interface IPost {
  id: string;
  _id?: string;
  author: IUser;
  media: IMediaItem[];
  type: PostType;
  caption: string;
  hashtags: string[];
  location?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isCommentsDisabled: boolean;
  isLikeCountHidden: boolean;
  visibility?: 'PUBLIC' | 'CLOSE_FRIENDS';
  poll?: IPoll;
  audioUrl?: string;
  communityId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  id: string;
  _id?: string;
  postId: string;
  author: IUser;
  content: string;
  audioUrl?: string;
  parentCommentId?: string;
  repliesCount: number;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum FollowStatus {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
}

export interface IFollow {
  id: string;
  follower: IUser;
  following: IUser;
  status: FollowStatus;
  createdAt: string;
}

export interface IStory {
  id: string;
  _id?: string;
  author: IUser;
  mediaUrl: string;
  mediaType: MediaType;
  caption?: string;
  stickers?: any[];
  visibility?: 'PUBLIC' | 'CLOSE_FRIENDS';
  poll?: IPoll;
  viewsCount: number;
  hasViewed?: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface IStoryHighlight {
  id: string;
  title: string;
  coverUrl: string;
  stories: IStory[];
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  VOICE = 'VOICE',
  GIF = 'GIF',
  POST_SHARE = 'POST_SHARE',
  PROFILE_SHARE = 'PROFILE_SHARE',
  LOCATION = 'LOCATION',
}

export interface IMessageReaction {
  user: string; // userId
  emoji: string;
}

export interface IMessage {
  id: string;
  _id?: string;
  conversationId: string;
  sender: IUser;
  text?: string;
  mediaUrl?: string;
  type: MessageType;
  sharedPost?: IPost;
  sharedProfile?: IUser;
  replyToMessageId?: string;
  reactions: IMessageReaction[];
  readBy: string[]; // array of user IDs
  isVanishMode?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IConversation {
  id: string;
  _id?: string;
  participants: IUser[];
  isGroup: boolean;
  name?: string;
  avatarUrl?: string;
  lastMessage?: IMessage;
  unreadCount?: number;
  isVanishMode?: boolean;
  updatedAt: string;
  createdAt: string;
}

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  FOLLOW_REQUEST = 'FOLLOW_REQUEST',
  FOLLOW_ACCEPT = 'FOLLOW_ACCEPT',
  MENTION = 'MENTION',
  STORY_REACTION = 'STORY_REACTION',
  STORY_REPLY = 'STORY_REPLY',
  MESSAGE = 'MESSAGE',
}

export interface INotification {
  id: string;
  _id?: string;
  recipient: string;
  sender: IUser;
  type: NotificationType;
  post?: IPost;
  story?: IStory;
  comment?: IComment;
  text?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ISavedCollection {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  posts: string[]; // Array of Post IDs
  postsCount: number;
  createdAt: string;
}

export interface ICommunity {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverUrl?: string;
  avatarUrl?: string;
  category: string;
  membersCount: number;
  isJoined?: boolean;
  createdBy: string;
  createdAt: string;
}

export enum ReportTargetType {
  POST = 'POST',
  USER = 'USER',
  COMMENT = 'COMMENT',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export interface IReport {
  id: string;
  reporter: IUser;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

