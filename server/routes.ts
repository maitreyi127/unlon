import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { insertUserSchema, insertActivitySchema, insertMessageSchema, insertActivityRequestSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'unalon-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Health check endpoint for deployment
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // Root health check for deployment services
  app.get("/", (req, res, next) => {
    // Check if this looks like a health check request
    const userAgent = req.headers['user-agent']?.toLowerCase() || '';
    const accept = req.headers.accept || '';
    
    // Common health check patterns
    const isHealthCheck = 
      userAgent.includes('healthcheck') ||
      userAgent.includes('probe') ||
      userAgent.includes('monitor') ||
      accept.includes('text/plain') ||
      req.query.health === 'check' ||
      // Basic requests without browser-like headers
      (!accept.includes('text/html') && !accept.includes('*/*'));
    
    if (isHealthCheck) {
      res.status(200).send('OK');
    } else {
      // Let the static file handler deal with regular browser requests
      next();
    }
  });

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Auth routes
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Simple auth - in production, verify password hash
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      req.session.userId = user.id;
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Activity routes
  app.get("/api/activities", requireAuth, async (req, res) => {
    try {
      const activities = await storage.getActivities(req.session.userId);
      
      // Add host and participant information to each activity
      const activitiesWithDetails = await Promise.all(
        activities.map(async (activity) => {
          const host = await storage.getUser(activity.hostId);
          const participants = await storage.getParticipantUsers(activity.participantIds || []);
          return {
            ...activity,
            host: host ? { ...host, password: undefined } : null,
            participants: participants.map(p => ({ ...p, password: undefined })),
          };
        })
      );

      res.json(activitiesWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/activities/:id", requireAuth, async (req, res) => {
    try {
      const activityId = req.params.id;
      const userId = req.session.userId!;
      const activity = await storage.getActivity(activityId);
      
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      // Check if user has requested (not including existing participation)
      const request = await storage.getUserActivityRequest(activityId, userId);

      // Add host, participant information and request status
      const host = await storage.getUser(activity.hostId);
      const participants = await storage.getParticipantUsers(activity.participantIds || []);
      const activityWithDetails = {
        ...activity,
        host: host ? { ...host, password: undefined } : null,
        participants: participants.map(p => ({ ...p, password: undefined })),
        userRequested: !!request
      };

      res.json(activityWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/activities", requireAuth, async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse({
        ...req.body,
        hostId: req.session.userId,
      });
      
      const activity = await storage.createActivity(activityData);
      const host = await storage.getUser(activity.hostId);
      
      res.json({
        ...activity,
        host: host ? { ...host, password: undefined } : null,
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/activities/:id/request", requireAuth, async (req, res) => {
    try {
      const activityId = req.params.id;
      const userId = req.session.userId!;

      // Check if activity exists
      const activity = await storage.getActivity(activityId);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      // Check if user is already a participant or host
      if (activity.hostId === userId || activity.participantIds?.includes(userId)) {
        return res.status(400).json({ message: "Already participating in this activity" });
      }

      // Check if activity is full
      if ((activity.currentParticipants || 0) >= activity.maxParticipants) {
        return res.status(400).json({ message: "Activity is full" });
      }

      // Create activity request
      const request = await storage.createActivityRequest({
        activityId,
        userId,
      });

      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/my-plans", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const activities = await storage.getActivitiesByParticipant(userId);
      
      // Add host information
      const activitiesWithHosts = await Promise.all(
        activities.map(async (activity) => {
          const host = await storage.getUser(activity.hostId);
          return {
            ...activity,
            host: host ? { ...host, password: undefined } : null,
          };
        })
      );

      // Separate upcoming and past activities
      const now = new Date();
      const upcoming = activitiesWithHosts.filter(a => new Date(a.datetime) > now);
      const past = activitiesWithHosts.filter(a => new Date(a.datetime) <= now);

      res.json({ upcoming, past });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Chat routes
  app.get("/api/conversations", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/messages/:userId", requireAuth, async (req, res) => {
    try {
      const currentUserId = req.session.userId!;
      const otherUserId = req.params.userId;
      
      const messages = await storage.getMessages(currentUserId, otherUserId);
      
      // Mark messages as read
      await storage.markMessagesAsRead(otherUserId, currentUserId);
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.session.userId,
      });
      
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
