/**
 * Main Application Component
 *
 * This is the root component of the application that defines the routing structure.
 * It sets up all the routes and their corresponding components.
 */

// React Router imports for navigation
import { Route, Routes } from "react-router-dom";

// Page components
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import NotFoundPage from "./pages/404/NotFoundPage";

// Layout component
import MainLayout from "./layout/MainLayout";

// Authentication component from Clerk
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

// Toast notifications
import { Toaster } from "react-hot-toast";

/**
 * App Component
 *
 * Defines the routing structure of the application using React Router.
 * Routes are organized as follows:
 * - Authentication routes (/sso-callback, /auth-callback)
 * - Admin route (/admin)
 * - Main application routes wrapped in MainLayout (/, /chat, /albums/:albumId)
 * - Catch-all route for 404 errors
 *
 * @returns {JSX.Element} The rendered application with routes
 */
function App() {
	return (
		<>
			<Routes>
				{/* Authentication routes */}
				<Route
					path='/sso-callback'
					element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
				/>
				<Route path='/auth-callback' element={<AuthCallbackPage />} />

				{/* Admin dashboard route */}
				<Route path='/admin' element={<AdminPage />} />

				{/* Main application routes wrapped in MainLayout */}
				<Route element={<MainLayout />}>
					{/* Home page */}
					<Route path='/' element={<HomePage />} />
					{/* Chat page for real-time messaging */}
					<Route path='/chat' element={<ChatPage />} />
					{/* Album details page with dynamic albumId parameter */}
					<Route path='/albums/:albumId' element={<AlbumPage />} />
					{/* Catch-all route for 404 errors */}
					<Route path='*' element={<NotFoundPage />} />
				</Route>
			</Routes>

			{/* Toast notification container */}
			<Toaster />
		</>
	);
}

export default App;
