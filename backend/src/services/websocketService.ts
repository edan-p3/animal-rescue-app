import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface SocketData {
  userId?: string;
  role?: string;
}

export class WebSocketService {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3001',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        // Allow unauthenticated connections for public updates
        return next();
      }

      try {
        const decoded = jwt.verify(token as string, JWT_SECRET) as JWTPayload;
        (socket.data as SocketData).userId = decoded.userId;
        (socket.data as SocketData).role = decoded.role;
        logger.info({ message: 'WebSocket authenticated', userId: decoded.userId });
        next();
      } catch (err) {
        logger.warn({ message: 'WebSocket authentication failed', error: err });
        // Allow connection but without authentication
        next();
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      const userId = (socket.data as SocketData).userId;
      logger.info({
        message: 'WebSocket client connected',
        socketId: socket.id,
        userId,
      });

      // Join user-specific room if authenticated
      if (userId) {
        socket.join(`user:${userId}`);
      }

      // Join public room for public case updates
      socket.join('public');

      socket.on('disconnect', () => {
        logger.info({
          message: 'WebSocket client disconnected',
          socketId: socket.id,
          userId,
        });
      });

      // Handle ping for connection testing
      socket.on('ping', () => {
        socket.emit('pong');
      });
    });
  }

  // Broadcast case created event
  broadcastCaseCreated(caseData: any) {
    if (caseData.isPublic) {
      this.io.to('public').emit('case_created', {
        event: 'case_created',
        data: { case: caseData },
      });
    } else {
      // Send only to owner and collaborators
      this.io.to(`user:${caseData.primaryOwnerId}`).emit('case_created', {
        event: 'case_created',
        data: { case: caseData },
      });
    }

    logger.info({ message: 'Broadcasted case_created', caseId: caseData.id });
  }

  // Broadcast case updated event
  broadcastCaseUpdated(caseId: string, changes: any, caseData: any) {
    if (caseData.isPublic) {
      this.io.to('public').emit('case_updated', {
        event: 'case_updated',
        data: {
          case_id: caseId,
          changes,
          case: caseData,
        },
      });
    } else {
      // Send to owner and collaborators
      this.io.to(`user:${caseData.primaryOwnerId}`).emit('case_updated', {
        event: 'case_updated',
        data: {
          case_id: caseId,
          changes,
          case: caseData,
        },
      });

      // Send to collaborators
      if (caseData.collaborators) {
        caseData.collaborators.forEach((collab: any) => {
          this.io.to(`user:${collab.userId}`).emit('case_updated', {
            event: 'case_updated',
            data: {
              case_id: caseId,
              changes,
              case: caseData,
            },
          });
        });
      }
    }

    logger.info({ message: 'Broadcasted case_updated', caseId });
  }

  // Broadcast case deleted event
  broadcastCaseDeleted(caseId: string) {
    this.io.to('public').emit('case_deleted', {
      event: 'case_deleted',
      data: { case_id: caseId },
    });

    logger.info({ message: 'Broadcasted case_deleted', caseId });
  }

  // Get Socket.IO instance
  getIO() {
    return this.io;
  }
}

let wsService: WebSocketService | null = null;

export const initializeWebSocket = (httpServer: HTTPServer) => {
  wsService = new WebSocketService(httpServer);
  return wsService;
};

export const getWebSocketService = (): WebSocketService => {
  if (!wsService) {
    throw new Error('WebSocket service not initialized');
  }
  return wsService;
};

