/**
 * Application Entry Point
 *
 * This is the main entry file for the React application.
 * It sets up the React root, providers, and renders the App component.
 */

// React imports
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Global styles
import "./index.css";

// Main App component
import App from "./App.tsx";

// Authentication and routing providers
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./providers/AuthProvider.tsx";

// Get Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Ensure the Clerk key is available
if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

/**
 * Application Rendering
 *
 * The provider hierarchy is as follows:
 * 1. StrictMode - Enables additional development checks
 * 2. ClerkProvider - Provides authentication context
 * 3. AuthProvider - Custom auth state management
 * 4. BrowserRouter - Enables client-side routing
 * 5. App - The main application component
 */
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		{/* Clerk authentication provider */}
		<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
			{/* Custom auth provider for application-specific auth state */}
			<AuthProvider>
				{/* React Router for navigation */}
				<BrowserRouter>
					{/* Main application component */}
					<App />
				</BrowserRouter>
			</AuthProvider>
		</ClerkProvider>
	</StrictMode>
);
