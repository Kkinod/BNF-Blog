/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			undici: require.resolve("undici"),
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
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		forceSwcTransforms: true,
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "Content-Security-Policy",
						value: `
							default-src 'self';
							script-src 'self' 'unsafe-inline' 'unsafe-eval';
							style-src 'self' 'unsafe-inline';
							img-src 'self' data: https: blob:;
							font-src 'self';
							object-src 'none';
							base-uri 'self';
							form-action 'self';
							frame-ancestors 'self';
							connect-src 'self' https://firebasestorage.googleapis.com;
							media-src 'self' https://firebasestorage.googleapis.com;
						`
							.replace(/\s{2,}/g, " ")
							.trim(),
					},
				],
			},
		];
	},
};

module.exports = nextConfig;
