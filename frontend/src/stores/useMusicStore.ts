/**
 * Music Store Module
 *
 * This module provides a global state management store for music-related data
 * using Zustand. It handles fetching, storing, and manipulating songs, albums,
 * and music statistics.
 */

// HTTP client for API requests
import { axiosInstance } from "@/lib/axios";

// Type definitions
import { Album, Song, Stats } from "@/types";

// Toast notifications
import toast from "react-hot-toast";

// Zustand state management
import { create } from "zustand";

/**
 * MusicStore Interface
 *
 * Defines the shape of the music store state and its actions
 */
interface MusicStore {
	// State properties
	songs: Song[];                // All songs in the application
	albums: Album[];              // All albums in the application
	isLoading: boolean;           // Loading state for async operations
	error: string | null;         // Error message if any operation fails
	currentAlbum: Album | null;   // Currently selected album
	featuredSongs: Song[];        // Songs featured on the homepage
	madeForYouSongs: Song[];      // Personalized song recommendations
	trendingSongs: Song[];        // Currently trending songs
	stats: Stats;                 // Music-related statistics

	// Actions (methods that modify the state)
	fetchAlbums: () => Promise<void>;                // Fetch all albums
	fetchAlbumById: (id: string) => Promise<void>;   // Fetch a specific album by ID
	fetchFeaturedSongs: () => Promise<void>;         // Fetch featured songs
	fetchMadeForYouSongs: () => Promise<void>;       // Fetch personalized recommendations
	fetchTrendingSongs: () => Promise<void>;         // Fetch trending songs
	fetchStats: () => Promise<void>;                 // Fetch music statistics
	fetchSongs: () => Promise<void>;                 // Fetch all songs
	deleteSong: (id: string) => Promise<void>;       // Delete a song by ID
	deleteAlbum: (id: string) => Promise<void>;      // Delete an album by ID
}

/**
 * Music Store Implementation
 *
 * Creates a Zustand store with state and actions for music-related functionality
 */
export const useMusicStore = create<MusicStore>((set) => ({
	// Initial state
	albums: [],              // Empty albums array
	songs: [],               // Empty songs array
	isLoading: false,         // Not loading initially
	error: null,             // No errors initially
	currentAlbum: null,       // No album selected initially
	madeForYouSongs: [],      // Empty personalized recommendations
	featuredSongs: [],        // Empty featured songs
	trendingSongs: [],        // Empty trending songs
	stats: {                  // Initial statistics
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},

	/**
	 * Delete Song
	 *
	 * Deletes a song by ID and updates the store state
	 *
	 * @param {string} id - The ID of the song to delete
	 */
	deleteSong: async (id) => {
		// Set loading state and clear any previous errors
		set({ isLoading: true, error: null });
		try {
			// Send DELETE request to the API
			await axiosInstance.delete(`/admin/songs/${id}`);

			// Update local state by filtering out the deleted song
			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));

			// Show success notification
			toast.success("Song deleted successfully");
		} catch (error: any) {
			// Log error and show error notification
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			// Reset loading state
			set({ isLoading: false });
		}
	},

	/**
	 * Delete Album
	 *
	 * Deletes an album by ID and updates the store state
	 * Also updates any songs that were part of this album
	 *
	 * @param {string} id - The ID of the album to delete
	 */
	deleteAlbum: async (id) => {
		// Set loading state and clear any previous errors
		set({ isLoading: true, error: null });
		try {
			// Send DELETE request to the API
			await axiosInstance.delete(`/admin/albums/${id}`);

			// Update local state by filtering out the deleted album
			// and updating any songs that were part of this album
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
			}));

			// Show success notification
			toast.success("Album deleted successfully");
		} catch (error: any) {
			// Show error notification with the error message
			toast.error("Failed to delete album: " + error.message);
		} finally {
			// Reset loading state
			set({ isLoading: false });
		}
	},

	/**
	 * Fetch All Songs
	 *
	 * Retrieves all songs from the API and updates the store
	 */
	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs");
			set({ songs: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	/**
	 * Fetch Statistics
	 *
	 * Retrieves music-related statistics from the API
	 */
	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/stats");
			set({ stats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	/**
	 * Fetch All Albums
	 *
	 * Retrieves all albums from the API and updates the store
	 */
	fetchAlbums: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await axiosInstance.get("/albums");
			set({ albums: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	/**
	 * Fetch Album by ID
	 *
	 * Retrieves a specific album by its ID and sets it as the current album
	 *
	 * @param {string} id - The ID of the album to fetch
	 */
	fetchAlbumById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			set({ currentAlbum: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	/**
	 * Fetch Featured Songs
	 *
	 * Retrieves songs for the featured section on the homepage
	 */
	fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/featured");
			set({ featuredSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	/**
	 * Fetch Made For You Songs
	 *
	 * Retrieves personalized song recommendations
	 */
	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/made-for-you");
			set({ madeForYouSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	/**
	 * Fetch Trending Songs
	 *
	 * Retrieves currently trending songs
	 */
	fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/trending");
			set({ trendingSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));
