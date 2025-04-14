/**
 * Song Controller
 *
 * This module contains controller functions for handling song-related API requests.
 * It provides endpoints for retrieving songs in various categories and formats.
 */

import { Song } from "../models/song.model.js";

/**
 * Get All Songs
 *
 * Retrieves all songs from the database, sorted by creation date (newest first)
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Array} JSON array of all songs
 */
export const getAllSongs = async (req, res, next) => {
	try {
		// -1 = Descending => newest -> oldest
		// 1 = Ascending => oldest -> newest
		const songs = await Song.find().sort({ createdAt: -1 });
		res.json(songs);
	} catch (error) {
		next(error); // Pass error to error handler middleware
	}
};

/**
 * Get Featured Songs
 *
 * Retrieves 6 random songs to display in the featured section
 * Uses MongoDB's aggregation pipeline with $sample operator
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Array} JSON array of 6 random songs with selected fields
 */
export const getFeaturedSongs = async (req, res, next) => {
	try {
		// Fetch 6 random songs using MongoDB's aggregation pipeline
		const songs = await Song.aggregate([
			{
				$sample: { size: 6 }, // Randomly select 6 documents
			},
			{
				$project: { // Include only these fields in the result
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};

/**
 * Get Made For You Songs
 *
 * Retrieves 4 random songs for the "Made For You" section
 * In a real application, this would use user preferences and listening history
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Array} JSON array of 4 random songs with selected fields
 */
export const getMadeForYouSongs = async (req, res, next) => {
	try {
		// For demo purposes, just returns 4 random songs
		// In a real app, would use user preferences and history
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 }, // Randomly select 4 documents
			},
			{
				$project: { // Include only these fields in the result
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};

/**
 * Get Trending Songs
 *
 * Retrieves 4 random songs for the "Trending" section
 * In a real application, this would use play counts and recent popularity
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Array} JSON array of 4 random songs with selected fields
 */
export const getTrendingSongs = async (req, res, next) => {
	try {
		// For demo purposes, just returns 4 random songs
		// In a real app, would use play counts and recent popularity
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 }, // Randomly select 4 documents
			},
			{
				$project: { // Include only these fields in the result
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);

		res.json(songs);
	} catch (error) {
		next(error);
	}
};
