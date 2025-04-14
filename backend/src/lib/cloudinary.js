/**
 * Cloudinary Configuration Module
 *
 * This module configures and exports the Cloudinary SDK for file uploads.
 * Cloudinary is used for storing and serving images and audio files.
 */

// Import Cloudinary SDK (v2)
import { v2 as cloudinary } from "cloudinary";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

/**
 * Configure Cloudinary with credentials from environment variables
 * - CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
 * - CLOUDINARY_API_KEY: Your Cloudinary API key
 * - CLOUDINARY_API_SECRET: Your Cloudinary API secret
 */
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export configured Cloudinary instance for use in other modules
export default cloudinary;
