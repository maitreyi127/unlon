import { type User, type InsertUser, type Activity, type InsertActivity, type Message, type InsertMessage, type ActivityRequest, type InsertActivityRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Activity methods
  getActivities(userId?: string): Promise<Activity[]>;
  getActivity(id: string): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined>;
  getActivitiesByHost(hostId: string): Promise<Activity[]>;
  getActivitiesByParticipant(userId: string): Promise<Activity[]>;

  // Message methods
  getConversations(userId: string): Promise<{ user: User; lastMessage: Message; unreadCount: number }[]>;
  getMessages(userId1: string, userId2: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(senderId: string, receiverId: string): Promise<void>;

  // Activity request methods
  createActivityRequest(request: InsertActivityRequest): Promise<ActivityRequest>;
  getActivityRequests(activityId: string): Promise<ActivityRequest[]>;
  getUserActivityRequest(activityId: string, userId: string): Promise<ActivityRequest | undefined>;
  updateActivityRequest(id: string, status: string): Promise<ActivityRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private activities: Map<string, Activity> = new Map();
  private messages: Map<string, Message> = new Map();
  private activityRequests: Map<string, ActivityRequest> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const users = [
      {
        id: "user1",
        username: "ethan_sf",
        email: "ethan@example.com",
        name: "Ethan",
        age: 24,
        location: "San Francisco",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        unalonScore: 85,
        interests: ["Hiking", "Photography", "Reading", "Cooking", "Travel"],
        favoriteQuote: "The only way to do great work is to love what you do.",
        createdAt: new Date(),
      },
      {
        id: "user2",
        username: "sarah_games",
        email: "sarah@example.com",
        name: "Sarah",
        age: 28,
        location: "San Francisco",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        unalonScore: 92,
        interests: ["Board Games", "Social", "Fun"],
        favoriteQuote: "Life is more fun when you share it with others.",
        createdAt: new Date(),
      },
      {
        id: "user3",
        username: "marcus_coffee",
        email: "marcus@example.com", 
        name: "Marcus",
        age: 26,
        location: "San Francisco",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        unalonScore: 78,
        interests: ["Coffee", "Conversations", "Philosophy"],
        favoriteQuote: "Good coffee and good conversation make everything better.",
        createdAt: new Date(),
      },
      {
        id: "user4",
        username: "alex_hiker",
        email: "alex@example.com",
        name: "Alex",
        age: 30,
        location: "San Francisco",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        unalonScore: 95,
        interests: ["Hiking", "Outdoors", "Adventure"],
        favoriteQuote: "The mountains are calling and I must go.",
        createdAt: new Date(),
      },
      {
        id: "user5",
        username: "maya_photo",
        email: "maya@example.com",
        name: "Maya",
        age: 25,
        location: "San Francisco", 
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        unalonScore: 88,
        interests: ["Photography", "Art", "Urban Exploration"],
        favoriteQuote: "Every picture tells a story.",
        createdAt: new Date(),
      },
      {
        id: "user6",
        username: "emma_bookworm",
        email: "emma@example.com",
        name: "Emma",
        age: 27,
        location: "San Francisco",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        unalonScore: 89,
        interests: ["Reading", "Books", "Writing"],
        favoriteQuote: "Books are a uniquely portable magic.",
        createdAt: new Date(),
      },
      {
        id: "user7",
        username: "david_musician",
        email: "david@example.com",
        name: "David",
        age: 31,
        location: "San Francisco",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        unalonScore: 91,
        interests: ["Music", "Guitar", "Jazz"],
        favoriteQuote: "Music is the universal language.",
        createdAt: new Date(),
      },
      {
        id: "user8",
        username: "lisa_yoga",
        email: "lisa@example.com",
        name: "Lisa",
        age: 29,
        location: "San Francisco",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        unalonScore: 93,
        interests: ["Yoga", "Meditation", "Wellness"],
        favoriteQuote: "Peace comes from within.",
        createdAt: new Date(),
      },
      {
        id: "user9",
        username: "james_cook",
        email: "james@example.com",
        name: "James",
        age: 33,
        location: "San Francisco",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        unalonScore: 87,
        interests: ["Cooking", "Food", "Culinary Arts"],
        favoriteQuote: "Good food is the foundation of genuine happiness.",
        createdAt: new Date(),
      },
      {
        id: "user10",
        username: "nina_artist",
        email: "nina@example.com",
        name: "Nina",
        age: 26,
        location: "San Francisco",
        avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        unalonScore: 90,
        interests: ["Art", "Painting", "Creative Expression"],
        favoriteQuote: "Art is the lie that enables us to realize the truth.",
        createdAt: new Date(),
      }
    ];

    users.forEach(user => this.users.set(user.id, user));

    // Create sample activities with varied participant counts
    const activities = [
      {
        id: "activity1",
        title: "Board Game Night",
        description: "🎲 Weekly social gathering for strategy games and fun!",
        hostId: "user2",
        location: "Community Center",
        datetime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
        duration: "3 hours",
        maxParticipants: 8,
        currentParticipants: 5,
        vibes: ["Social", "Fun"],
        participantIds: ["user1", "user3", "user4", "user6", "user7"],
        image: "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        userRequested: false,
        createdAt: new Date(),
      },
      {
        id: "activity2",
        title: "Coffee & Conversation",
        description: "☕ Deep conversations over great coffee - perfect Sunday morning!",
        hostId: "user3",
        location: "Blue Bottle Coffee",
        datetime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        duration: "1.5 hours",
        maxParticipants: 6,
        currentParticipants: 3,
        vibes: ["Chill", "Talkative"],
        participantIds: ["user5", "user8", "user9"],
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        userRequested: false,
        createdAt: new Date(),
      },
      {
        id: "activity3",
        title: "Weekend Hiking Adventure",
        description: "🥾 Explore beautiful trails with amazing city views!",
        hostId: "user4",
        location: "Twin Peaks Trailhead",
        datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        duration: "4 hours",
        maxParticipants: 12,
        currentParticipants: 7,
        vibes: ["Adventurous", "Outdoors"],
        participantIds: ["user1", "user2", "user3", "user5", "user6", "user8", "user10"],
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        userRequested: false,
        createdAt: new Date(),
      },
      {
        id: "activity4",
        title: "Urban Photography Walk",
        description: "📸 Capture the city's hidden gems and street art!",
        hostId: "user5",
        location: "Mission District",
        datetime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        duration: "2.5 hours",
        maxParticipants: 10,
        currentParticipants: 4,
        vibes: ["Creative", "Urban"],
        participantIds: ["user2", "user4", "user7", "user10"],
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        userRequested: false,
        createdAt: new Date(),
      }
    ];

    activities.forEach(activity => this.activities.set(activity.id, activity));

    // Create sample messages
    const messages = [
      {
        id: "msg1",
        senderId: "user2",
        receiverId: "user1",
        content: "Hi! Thanks for joining the board game night!",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: true,
      },
      {
        id: "msg2",
        senderId: "user1",
        receiverId: "user2",
        content: "Excited to be there! What games are we playing?",
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        isRead: true,
      },
      {
        id: "msg3",
        senderId: "user2",
        receiverId: "user1",
        content: "Great! See you tonight for board games 🎲",
        timestamp: new Date(Date.now() - 30 * 1000),
        isRead: false,
      },
      {
        id: "msg4",
        senderId: "user3",
        receiverId: "user1",
        content: "Looking forward to our coffee chat tomorrow!",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        isRead: true,
      },
    ];

    messages.forEach(message => this.messages.set(message.id, message));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      unalonScore: 0,
      createdAt: new Date(),
      age: insertUser.age ?? null,
      location: insertUser.location ?? null,
      avatar: insertUser.avatar ?? null,
      interests: Array.isArray(insertUser.interests) ? insertUser.interests : null,
      favoriteQuote: insertUser.favoriteQuote ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async getActivities(userId?: string): Promise<Activity[]> {
    const activities = Array.from(this.activities.values()).sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
    
    if (userId) {
      // Check if user has requested each activity (not including existing participation)
      return Promise.all(activities.map(async (activity) => {
        const request = await this.getUserActivityRequest(activity.id, userId);
        return {
          ...activity,
          userRequested: !!request
        };
      }));
    }
    
    return activities;
  }

  async getActivity(id: string): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...insertActivity,
      id,
      currentParticipants: 0,
      participantIds: [],
      userRequested: false,
      createdAt: new Date(),
      vibes: Array.isArray(insertActivity.vibes) ? insertActivity.vibes : null,
      image: insertActivity.image ?? null,
    };
    this.activities.set(id, activity);
    return activity;
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined> {
    const activity = this.activities.get(id);
    if (!activity) return undefined;
    
    const updatedActivity = { ...activity, ...updates };
    this.activities.set(id, updatedActivity);
    return updatedActivity;
  }

  async getParticipantUsers(participantIds: string[]): Promise<User[]> {
    const participants: User[] = [];
    for (const id of participantIds) {
      const user = this.users.get(id);
      if (user) {
        participants.push(user);
      }
    }
    return participants;
  }

  async getActivitiesByHost(hostId: string): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(activity => activity.hostId === hostId);
  }

  async getActivitiesByParticipant(userId: string): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(activity => 
      activity.participantIds?.includes(userId) || activity.hostId === userId
    );
  }

  async getConversations(userId: string): Promise<{ user: User; lastMessage: Message; unreadCount: number }[]> {
    const userMessages = Array.from(this.messages.values()).filter(
      msg => msg.senderId === userId || msg.receiverId === userId
    );

    const conversationMap = new Map<string, { lastMessage: Message; messages: Message[] }>();

    userMessages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, { lastMessage: message, messages: [message] });
      } else {
        const conv = conversationMap.get(otherUserId)!;
        conv.messages.push(message);
        if (message.timestamp && conv.lastMessage.timestamp && message.timestamp > conv.lastMessage.timestamp) {
          conv.lastMessage = message;
        }
      }
    });

    const conversations = [];
    for (const [otherUserId, { lastMessage, messages }] of Array.from(conversationMap.entries())) {
      const user = this.users.get(otherUserId);
      if (user) {
        const unreadCount = messages.filter((msg: any) => 
          msg.senderId === otherUserId && msg.receiverId === userId && !msg.isRead
        ).length;
        
        conversations.push({ user, lastMessage, unreadCount });
      }
    }

    return conversations.sort((a, b) => {
      const bTime = b.lastMessage.timestamp ? b.lastMessage.timestamp.getTime() : 0;
      const aTime = a.lastMessage.timestamp ? a.lastMessage.timestamp.getTime() : 0;
      return bTime - aTime;
    });
  }

  async getMessages(userId1: string, userId2: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => 
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
      )
      .sort((a, b) => {
        const aTime = a.timestamp ? a.timestamp.getTime() : 0;
        const bTime = b.timestamp ? b.timestamp.getTime() : 0;
        return aTime - bTime;
      });
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
      isRead: false,
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    for (const message of Array.from(this.messages.values())) {
      if (message.senderId === senderId && message.receiverId === receiverId && !message.isRead) {
        message.isRead = true;
      }
    }
  }

  async createActivityRequest(insertRequest: InsertActivityRequest): Promise<ActivityRequest> {
    const id = randomUUID();
    const request: ActivityRequest = {
      ...insertRequest,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.activityRequests.set(id, request);
    return request;
  }

  async getActivityRequests(activityId: string): Promise<ActivityRequest[]> {
    return Array.from(this.activityRequests.values()).filter(req => req.activityId === activityId);
  }

  async getUserActivityRequest(activityId: string, userId: string): Promise<ActivityRequest | undefined> {
    return Array.from(this.activityRequests.values()).find(req => 
      req.activityId === activityId && req.userId === userId
    );
  }

  async updateActivityRequest(id: string, status: string): Promise<ActivityRequest | undefined> {
    const request = this.activityRequests.get(id);
    if (!request) return undefined;
    
    request.status = status;
    this.activityRequests.set(id, request);
    return request;
  }
}

export const storage = new MemStorage();
