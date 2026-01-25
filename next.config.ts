import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com", // ✅ Google avatars
				port: "",
				pathname: "/**", // ✅ All paths
			},
		],
	},
};

export default nextConfig;
