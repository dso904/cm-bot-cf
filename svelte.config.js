import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import dotenv from "dotenv";
import { execSync } from "child_process";

// Load environment variables from both .env.local and .env
dotenv.config({ path: "./.env.local" });
dotenv.config({ path: "./.env" });

// Function to get the current commit SHA for version tracking
function getCurrentCommitSHA() {
	try {
		return execSync("git rev-parse HEAD").toString().trim();
	} catch (error) {
		console.error("Error getting current commit SHA:", error);
		return "unknown";
	}
}

// Set public environment variables (Cloudflare Pages only exposes PUBLIC_* variables)
process.env.PUBLIC_VERSION ??= process.env.npm_package_version;
process.env.PUBLIC_COMMIT_SHA ??= getCurrentCommitSHA();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Enable Vite preprocessing
	preprocess: vitePreprocess(),

	kit: {
		// Use the Cloudflare Pages adapter
		adapter: adapter(),

		paths: {
			// Use a PUBLIC_ prefix to ensure it's available on Cloudflare Pages
			base: process.env.PUBLIC_APP_BASE || "",
			relative: false,
		},

		csrf: {
			checkOrigin: false, // Cloudflare handles security, so no need for origin check
		},

		csp: {
			directives: {
				// Conditionally allow iframes based on environment variable
				...(process.env.ALLOW_IFRAME === "true" ? {} : { "frame-ancestors": ["'none'"] }),
			},
		},

		prerender: {
			entries: ["*"], // Ensures ALL routes are pre-rendered for static deployment
		},

		appDir: "_app", // Avoids potential path conflicts in Cloudflare deployment
	},
};

export default config;
