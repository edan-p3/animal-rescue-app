import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../utils/db';
import { AppError } from '../middleware/errorHandler';
import { ErrorCode, AuthResponse, JWTPayload } from '../types';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_ACCESS_EXPIRY: string = process.env.JWT_ACCESS_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
const BCRYPT_ROUNDS = 12;

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    name: string;
    role: string;
    phone?: string;
    organization?: string;
  }): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(
        409,
        ErrorCode.RESOURCE_CONFLICT,
        'Email already exists',
        [{ field: 'email', message: 'Email is already in use' }]
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: data.role,
        phone: data.phone,
        organization: data.organization,
      },
    });

    logger.info({ message: 'User registered', userId: user.id, email: user.email });

    // Generate tokens
    const { access_token, refresh_token } = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl || undefined,
      },
      access_token,
      refresh_token,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(
        401,
        ErrorCode.AUTH_INVALID_CREDENTIALS,
        'Invalid email or password'
      );
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AppError(
        403,
        ErrorCode.PERMISSION_DENIED,
        'Account is not active'
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(
        401,
        ErrorCode.AUTH_INVALID_CREDENTIALS,
        'Invalid email or password'
      );
    }

    logger.info({ message: 'User logged in', userId: user.id, email: user.email });

    // Generate tokens
    const { access_token, refresh_token } = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl || undefined,
      },
      access_token,
      refresh_token,
    };
  }

  async refresh(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    // Hash the refresh token to look it up
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Find refresh token in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken) {
      throw new AppError(
        401,
        ErrorCode.AUTH_TOKEN_INVALID,
        'Invalid refresh token'
      );
    }

    // Check if token has expired
    if (storedToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      throw new AppError(
        401,
        ErrorCode.AUTH_TOKEN_EXPIRED,
        'Refresh token has expired'
      );
    }

    // Delete old refresh token (rotation)
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Generate new tokens
    const { access_token, refresh_token } = await this.generateTokens(storedToken.user);

    return { access_token, refresh_token };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Delete refresh token
    await prisma.refreshToken.deleteMany({
      where: { tokenHash },
    });

    logger.info({ message: 'User logged out' });
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        avatarUrl: true,
        organization: true,
        location: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(
        404,
        ErrorCode.RESOURCE_NOT_FOUND,
        'User not found'
      );
    }

    return user;
  }

  private async generateTokens(user: { id: string; email: string; role: string }) {
    // Generate access token
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const signOptions: jwt.SignOptions = {
      expiresIn: JWT_ACCESS_EXPIRY as any,
    };

    const access_token = jwt.sign(payload, JWT_SECRET, signOptions);

    // Generate refresh token
    const refresh_token = crypto.randomBytes(64).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(refresh_token).digest('hex');

    // Calculate expiry date
    const expiryMs = this.parseExpiry(JWT_REFRESH_EXPIRY);
    const expiresAt = new Date(Date.now() + expiryMs);

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return { access_token, refresh_token };
  }

  private parseExpiry(expiry: string): number {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1), 10);

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 7 * 24 * 60 * 60 * 1000; // Default 7 days
    }
  }
}

export default new AuthService();

