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
	},
};

module.exports = nextConfig;
