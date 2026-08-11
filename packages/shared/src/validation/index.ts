import { z } from 'zod';

export const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(50),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters, numbers, underscores and dots'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  dob: z.string().optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  login: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).max(50).optional(),
  bio: z.string().max(150, 'Bio must be at most 150 characters').optional(),
  website: z.string().url('Invalid URL').or(z.literal('')).optional(),
  category: z.string().optional(),
  isPrivate: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const CreatePostSchema = z.object({
  caption: z.string().max(2200, 'Caption limit is 2200 characters').optional(),
  media: z
    .array(
      z.object({
        url: z.string().min(1),
        type: z.enum(['IMAGE', 'VIDEO']),
        aspectRatio: z.enum(['1:1', '4:5', '16:9', '9:16']).optional().default('1:1'),
        thumbnailUrl: z.string().optional(),
      })
    )
    .min(1, 'At least one media item is required'),
  location: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  isCommentsDisabled: z.boolean().optional(),
  isLikeCountHidden: z.boolean().optional(),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;

export const CreateCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
  parentCommentId: z.string().optional(),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

export const SendMessageSchema = z.object({
  conversationId: z.string().optional(),
  recipientId: z.string().optional(),
  text: z.string().optional(),
  mediaUrl: z.string().optional(),
  type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'VOICE', 'GIF', 'POST_SHARE', 'PROFILE_SHARE', 'LOCATION']),
  sharedPostId: z.string().optional(),
  sharedProfileId: z.string().optional(),
  replyToMessageId: z.string().optional(),
});

export type SendMessageInput = z.infer<typeof SendMessageSchema>;
