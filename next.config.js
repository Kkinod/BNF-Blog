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
							style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
							img-src 'self' data: https: blob:;
							font-src 'self' data: https://fonts.gstatic.com;
							object-src 'none';
							base-uri 'self';
							form-action 'self';
							frame-ancestors 'self';
							connect-src 'self' https://firebasestorage.googleapis.com;
							media-src 'self' https://firebasestorage.googleapis.com;
							frame-src 'self' https://www.youtube.com https://player.vimeo.com;
						`
							.replace(/\s{2,}/g, " ")
							.trim(),
					},
					{
						key: "Permissions-Policy",
						value: "geolocation=(), camera=(), microphone=()",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=31536000; includeSubDomains; preload",
					},
				],
			},
		];
	},
};

module.exports = nextConfig;
