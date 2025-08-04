# Replit.md

## Overview

Unalon is a social activity planning mobile web application that helps users connect and organize activities together. The app uses the tagline "NEVER DO IT ALON" and focuses on community building through shared experiences. It's built as a full-stack TypeScript application with a React frontend and Express backend, designed with a mobile-first approach.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (configured but may need setup)
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Session Management**: Express sessions for authentication

## Key Components

### Frontend Architecture
- **Mobile-first design** with a maximum width container for mobile devices
- **Component-based architecture** using React functional components with hooks
- **Type-safe development** with TypeScript throughout
- **Modern UI components** from shadcn/ui with Radix UI primitives
- **Responsive design** using Tailwind CSS utility classes

### Backend Architecture
- **RESTful API** built with Express.js
- **Session-based authentication** using express-session
- **Type-safe database operations** using Drizzle ORM
- **In-memory storage** for development (MemStorage class)
- **Modular route handling** with centralized error handling

### Database Schema
The application uses four main entities:
- **Users**: Profile information, scores, interests, and authentication data
- **Activities**: Event details, participants, and metadata
- **Messages**: Direct messaging between users
- **Activity Requests**: Join requests for activities with approval workflow

### Authentication & Authorization
- **Session-based authentication** with secure cookie configuration
- **Protected routes** using a ProtectedRoute component wrapper
- **Demo authentication** for easy testing with predefined users
- **Authorization middleware** for API endpoint protection

## Data Flow

1. **User Authentication**: Login flow redirects to main app or shows login page
2. **Activity Discovery**: Homepage displays available activities from API
3. **Real-time Updates**: TanStack Query manages cache invalidation and refetching
4. **Social Features**: Messaging system enables user communication
5. **Activity Management**: Users can create, join, and manage activities

## External Dependencies

### Core Framework Dependencies
- **React 18** with modern hooks and concurrent features
- **Express.js** for server-side API handling
- **Drizzle ORM** for type-safe database operations
- **TanStack Query** for server state management

### UI and Styling
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library built on Radix UI
- **Google Fonts** (Playfair Display, Plus Jakarta Sans, Roboto)
- **Material Icons** for consistent iconography

### Development Tools
- **Vite** for fast development and building
- **TypeScript** for type safety
- **ESBuild** for production bundling

### Database and Storage
- **@neondatabase/serverless** for PostgreSQL connection
- **connect-pg-simple** for session storage
- **In-memory storage** as fallback for development

## Deployment Strategy

### Development Environment
- **Vite dev server** for frontend with HMR
- **tsx** for running TypeScript server code directly
- **Development-specific features** like replit integration and error overlays

### Production Build Process
1. **Frontend build**: Vite builds React app to `dist/public`
2. **Backend build**: ESBuild bundles server code to `dist/index.js`
3. **Static file serving**: Production server serves built frontend files
4. **Environment variables**: Database URL and session secrets from environment

### Database Management
- **Drizzle migrations** for schema changes
- **Push command** for development schema updates
- **PostgreSQL dialect** configured for production database

The application is designed to be easily deployable to cloud platforms with minimal configuration, requiring only database URL and session secret environment variables.