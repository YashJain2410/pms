import bundleAnalyzer from "@next/bundle-analyzer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const rawBackendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const backendOrigin = rawBackendUrl
	.replace(/\/api\/v1\/?$/, "")
	.replace(/\/$/, "")
	.replace("http://localhost:", "http://127.0.0.1:")
	.replace("https://localhost:", "https://127.0.0.1:");

const nextConfig = {
	turbopack: {
		root: __dirname,
	},
	experimental: {
		optimizePackageImports: ["recharts", "framer-motion", "lucide-react", "@radix-ui/react-icons", "date-fns", "lodash"],
	},
	compress: true,
	images: {
		formats: ["image/avif", "image/webp"],
		minimumCacheTTL: 60,
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: `${backendOrigin}/api/:path*`,
			},
		];
	},
	async headers() {
		return [
			{
				source: "/fonts/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},
};

export default withBundleAnalyzer(nextConfig);
