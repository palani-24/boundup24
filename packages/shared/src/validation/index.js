"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageSchema = exports.CreateCommentSchema = exports.CreatePostSchema = exports.UpdateProfileSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, 'Full name must be at least 2 characters').max(50),
    username: zod_1.z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30)
        .regex(/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters, numbers, underscores and dots'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    dob: zod_1.z.string().optional(),
});
exports.LoginSchema = zod_1.z.object({
    login: zod_1.z.string().min(1, 'Email or username is required'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.UpdateProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).max(50).optional(),
    bio: zod_1.z.string().max(150, 'Bio must be at most 150 characters').optional(),
    website: zod_1.z.string().url('Invalid URL').or(zod_1.z.literal('')).optional(),
    category: zod_1.z.string().optional(),
    isPrivate: zod_1.z.boolean().optional(),
});
exports.CreatePostSchema = zod_1.z.object({
    caption: zod_1.z.string().max(2200, 'Caption limit is 2200 characters').optional(),
    media: zod_1.z
        .array(zod_1.z.object({
        url: zod_1.z.string().min(1),
        type: zod_1.z.enum(['IMAGE', 'VIDEO']),
        aspectRatio: zod_1.z.enum(['1:1', '4:5', '16:9', '9:16']),
        thumbnailUrl: zod_1.z.string().optional(),
    }))
        .min(1, 'At least one media item is required'),
    location: zod_1.z.string().optional(),
    hashtags: zod_1.z.array(zod_1.z.string()).optional(),
    isCommentsDisabled: zod_1.z.boolean().optional(),
    isLikeCountHidden: zod_1.z.boolean().optional(),
});
exports.CreateCommentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, 'Comment cannot be empty').max(1000),
    parentCommentId: zod_1.z.string().optional(),
});
exports.SendMessageSchema = zod_1.z.object({
    conversationId: zod_1.z.string().optional(),
    recipientId: zod_1.z.string().optional(),
    text: zod_1.z.string().optional(),
    mediaUrl: zod_1.z.string().optional(),
    type: zod_1.z.enum(['TEXT', 'IMAGE', 'VIDEO', 'VOICE', 'GIF', 'POST_SHARE', 'PROFILE_SHARE', 'LOCATION']),
    sharedPostId: zod_1.z.string().optional(),
    sharedProfileId: zod_1.z.string().optional(),
    replyToMessageId: zod_1.z.string().optional(),
});
