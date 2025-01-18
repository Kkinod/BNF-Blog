/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.externals = [...config.externals, "bcrypt"];
		config.resolve.alias = {
			...config.resolve.alias,
			'undici': require.resolve('undici'),
		};
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
			},
		],
	},
	env: {
		AUTH_SECRET: process.env.AUTH_SECRET,
		VERCEL_URL: process.env.VERCEL_URL,
		NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL,
	},
};

module.exports = nextConfig;
