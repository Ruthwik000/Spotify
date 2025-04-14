/**
 * Song Model
 *
 * This module defines the schema and model for songs in the application.
 * Songs can be part of an album and have properties like title, artist, and audio URL.
 */

import mongoose from "mongoose";

/**
 * Song Schema Definition
 *
 * Defines the structure and validation rules for song documents in MongoDB
 */
const songSchema = new mongoose.Schema(
	{
		// Title of the song
		title: {
			type: String,
			required: true,
		},
		// Artist who performed the song
		artist: {
			type: String,
			required: true,
		},
		// URL to the song's cover image (stored in Cloudinary)
		imageUrl: {
			type: String,
			required: true,
		},
		// URL to the song's audio file (stored in Cloudinary)
		audioUrl: {
			type: String,
			required: true,
		},
		// Duration of the song in seconds
		duration: {
			type: Number,
			required: true,
		},
		// Reference to the album this song belongs to (optional)
		albumId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album", // References the Album model
			required: false, // Songs can exist without being part of an album
		},
	},
	{
		// Automatically add createdAt and updatedAt timestamps
		timestamps: true
	}
);

// Create and export the Song model
export const Song = mongoose.model("Song", songSchema);
