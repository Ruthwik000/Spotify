/**
 * Main entry point for the backend server
 * This file sets up the Express server, middleware, routes, and starts the server
 */

// Import required packages
import express from "express";
import dotenv from "dotenv"; // For loading environment variables
import { clerkMiddleware } from "@clerk/express"; // Authentication middleware
import fileUpload from "express-fileupload"; // For handling file uploads
import path from "path";
import cors from "cors"; // For handling Cross-Origin Resource Sharing
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron"; // For scheduling tasks

// Import socket.io initialization function
import { initializeSocket } from "./lib/socket.js";

// Import database connection function
import { connectDB } from "./lib/db.js";

// Import route handlers
import userRoutes from "./routes/user.route.js"; // User-related routes
import adminRoutes from "./routes/admin.route.js"; // Admin-related routes
import authRoutes from "./routes/auth.route.js"; // Authentication routes
import songRoutes from "./routes/song.route.js"; // Song-related routes
import albumRoutes from "./routes/album.route.js"; // Album-related routes
import statRoutes from "./routes/stat.route.js"; // Statistics routes

// Load environment variables from .env file
dotenv.config();

// Set up directory path and Express application
const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

// Create HTTP server and initialize Socket.IO
const httpServer = createServer(app);
initializeSocket(httpServer);

/**
 * Middleware Setup
 */
// Enable CORS for frontend requests
app.use(
	cors({
		origin: "http://localhost:3000", // Allow requests from frontend
		credentials: true, // Allow cookies to be sent with requests
	})
);

// Parse JSON request bodies
app.use(express.json());

// Add Clerk authentication middleware
app.use(clerkMiddleware()); // Adds auth to req object => req.auth

// Configure file upload middleware
app.use(
	fileUpload({
		useTempFiles: true, // Store uploaded files in temp directory
		tempFileDir: path.join(__dirname, "tmp"),
		createParentPath: true, // Create parent directories if they don't exist
		limits: {
			fileSize: 10 * 1024 * 1024, // 10MB max file size
		},
	})
);

/**
 * Scheduled Tasks
 */
// Set up hourly cron job to clean up temporary files
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => { // Run every hour at minute 0
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("error", err);
				return;
			}
			// Delete all files in the temp directory
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {/* Ignore errors */});
			}
		});
	}
});

/**
 * API Routes
 */
// Register all API route handlers
app.use("/api/users", userRoutes);  // User management endpoints
app.use("/api/admin", adminRoutes); // Admin-only endpoints
app.use("/api/auth", authRoutes);   // Authentication endpoints
app.use("/api/songs", songRoutes);  // Song management endpoints
app.use("/api/albums", albumRoutes); // Album management endpoints
app.use("/api/stats", statRoutes);  // Statistics and analytics endpoints

/**
 * Production Configuration
 */
// Serve static frontend files in production mode
if (process.env.NODE_ENV === "production") {
	// Serve static files from the frontend build directory
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	// For any other routes, serve the index.html file (client-side routing)
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
	});
}

/**
 * Error Handling
 */
// Global error handler middleware
app.use((err, req, res, next) => {
	// In production, show generic error; in development, show actual error message
	res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});

/**
 * Server Startup
 */
// Start the HTTP server and connect to the database
httpServer.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
	connectDB(); // Establish connection to MongoDB
});
