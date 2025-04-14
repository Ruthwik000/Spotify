<h1 align="center">Realtime Spotify Application ✨</h1>

![Demo App](/frontend/public/screenshot-for-readme.png)

## Project Overview

This is a real-time Spotify clone application with the following features:
- 🎸 Listen to music, play next and previous songs
- 🔈 Update the volume with a slider
- 🎧 Admin dashboard to create albums and songs
- 💬 Real-time Chat App integrated into Spotify
- 👨🏼‍💼 Online/Offline status
- 👀 See what other users are listening to in real-time
- 📊 Aggregate data for the analytics page

## Project Structure

### Root Directory
- `package.json` - Root package file with scripts to build and start the application
- `.env` - Environment variables for the application

### Backend (`/backend`)
The backend is built with Node.js, Express, and MongoDB.

#### Key Files and Directories:
- `src/index.js` - Main entry point for the backend server
- `src/lib/` - Contains utility functions for database, socket.io, and cloudinary
- `src/controller/` - Contains controller functions for handling API requests
- `src/models/` - MongoDB schema definitions
- `src/routes/` - API route definitions
- `src/middleware/` - Custom middleware functions
- `src/seeds/` - Seed data for the application

### Frontend (`/frontend`)
The frontend is built with React, TypeScript, and Vite.

#### Key Files and Directories:
- `src/main.tsx` - Main entry point for the React application
- `src/App.tsx` - Main component with route definitions
- `src/components/` - Reusable UI components
- `src/pages/` - Page components for different routes
- `src/layout/` - Layout components for the application
- `src/stores/` - State management using Zustand
- `src/lib/` - Utility functions
- `src/providers/` - Context providers

## Setup Instructions

### Backend Environment Variables
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ADMIN_EMAIL=your_admin_email
NODE_ENV=development

CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Frontend Environment Variables
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Installation and Running

1. Install dependencies:
   ```
   npm install
   ```

2. Start the application:
   ```
   npm start
   ```

3. For development:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

## File Documentation

This section provides detailed documentation for key files in the project.

### Backend Files

#### src/index.js
The main entry point for the backend server. It sets up Express, middleware, routes, and starts the server.

#### src/lib/db.js
Handles the MongoDB connection.

#### src/lib/socket.js
Sets up Socket.IO for real-time communication.

#### src/lib/cloudinary.js
Configures Cloudinary for image and audio file uploads.

### Frontend Files

#### src/main.tsx
The entry point for the React application, sets up the Clerk authentication provider.

#### src/App.tsx
Defines the routes for the application using React Router.

#### src/stores/useMusicStore.ts
Manages the state for music playback using Zustand.

#### src/stores/useChatStore.ts
Manages the state for the chat functionality.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
