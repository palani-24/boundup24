import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { RegisterSchema, LoginSchema } from '../../../../packages/shared/src';
import { AppError } from '../middleware/error';
import { AuthRequest } from '../middleware/auth';

const generateTokens = (userId: string) => {
  const accessSecret = process.env.JWT_SECRET || 'super_secret_boundup_jwt_access_key_2026_change_in_production';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'super_secret_boundup_jwt_refresh_key_2026_change_in_production';

  const accessToken = jwt.sign({ id: userId }, accessSecret, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ id: userId }, refreshSecret, { expiresIn: '30d' });

  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = RegisterSchema.parse(req.body);

    const existingEmail = await User.findOne({ email: validated.email.toLowerCase() });
    if (existingEmail) {
      return next(new AppError('Email address is already in use', 400));
    }

    const existingUsername = await User.findOne({ username: validated.username.toLowerCase() });
    if (existingUsername) {
      return next(new AppError('Username is already taken', 400));
    }

    const user = await User.create({
      fullName: validated.fullName,
      username: validated.username,
      email: validated.email,
      passwordHash: validated.password,
      dob: validated.dob ? new Date(validated.dob) : undefined,
    });

    const tokens = generateTokens(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return next(new AppError(error.errors[0]?.message || 'Invalid input data', 400));
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = LoginSchema.parse(req.body);

    const loginLower = validated.login.toLowerCase();
    const user = await User.findOne({
      $or: [{ email: loginLower }, { username: loginLower }],
    });

    if (!user || !(await user.comparePassword(validated.password))) {
      return next(new AppError('Invalid email/username or password', 401));
    }

    if (user.status === 'SUSPENDED') {
      return next(new AppError('Account is suspended. Contact administration.', 403));
    }

    const tokens = generateTokens(user._id.toString());

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return next(new AppError(error.errors[0]?.message || 'Invalid login payload', 400));
    }
    next(error);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};
