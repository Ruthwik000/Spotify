/**
 * Socket.IO Module
 *
 * This module initializes and configures Socket.IO for real-time communication.
 * It handles user connections, messaging, and activity tracking.
 */

import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

/**
 * Initializes Socket.IO with the provided HTTP server
 * Sets up event handlers for real-time communication
 *
 * @param {Object} server - HTTP server instance to attach Socket.IO to
 */
export const initializeSocket = (server) => {
	// Initialize Socket.IO server with CORS configuration
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:3000", // Allow connections from frontend
			credentials: true, // Allow credentials (cookies, etc.)
		},
	});

	// Maps to track connected users and their activities
	const userSockets = new Map(); // Maps userId to socketId
	const userActivities = new Map(); // Maps userId to current activity

	// Handle new socket connections
	io.on("connection", (socket) => {
		/**
		 * Event: user_connected
		 * Triggered when a user connects to the socket server
		 */
		socket.on("user_connected", (userId) => {
			// Store the user's socket ID
			userSockets.set(userId, socket.id);
			// Set initial activity status
			userActivities.set(userId, "Idle");

			// Broadcast to all clients that this user has connected
			io.emit("user_connected", userId);

			// Send list of online users to the newly connected user
			socket.emit("users_online", Array.from(userSockets.keys()));

			// Broadcast all user activities to all clients
			io.emit("activities", Array.from(userActivities.entries()));
		});

		/**
		 * Event: update_activity
		 * Triggered when a user's activity changes (e.g., listening to music)
		 */
		socket.on("update_activity", ({ userId, activity }) => {
			console.log("activity updated", userId, activity);
			// Update the user's activity in the map
			userActivities.set(userId, activity);
			// Broadcast the updated activity to all clients
			io.emit("activity_updated", { userId, activity });
		});

		/**
		 * Event: send_message
		 * Triggered when a user sends a chat message
		 */
		socket.on("send_message", async (data) => {
			try {
				const { senderId, receiverId, content } = data;

				// Create and save the message in the database
				const message = await Message.create({
					senderId,
					receiverId,
					content,
				});

				// Send the message to the receiver if they're online
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
				}

				// Confirm to the sender that the message was sent
				socket.emit("message_sent", message);
			} catch (error) {
				// Handle and report any errors
				console.error("Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

		/**
		 * Event: disconnect
		 * Triggered when a user disconnects from the socket server
		 */
		socket.on("disconnect", () => {
			let disconnectedUserId;

			// Find the user ID associated with the disconnected socket
			for (const [userId, socketId] of userSockets.entries()) {
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					// Remove the user from tracking maps
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}

			// Broadcast the disconnection to all clients if a user was found
			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
	});
};
