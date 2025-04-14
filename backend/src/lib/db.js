/**
 * Database Connection Module
 *
 * This module handles the connection to MongoDB using Mongoose.
 * It exports a function that establishes the connection and handles errors.
 */

import mongoose from "mongoose";

/**
 * Connects to MongoDB using the connection string from environment variables
 * Exits the process with code 1 if connection fails
 *
 * @returns {Promise<void>} A promise that resolves when connected successfully
 */
export const connectDB = async () => {
	try {
		// Attempt to connect to MongoDB using the URI from environment variables
		const conn = await mongoose.connect(process.env.MONGODB_URI);

		// Log successful connection with the host information
		console.log(`Connected to MongoDB ${conn.connection.host}`);
	} catch (error) {
		// Log error and exit the process if connection fails
		console.log("Failed to connect to MongoDB", error);
		process.exit(1); // 1 is failure, 0 is success
	}
};
