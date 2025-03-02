"use server";

import { headers } from "next/headers";
import { type Ratelimit } from "@upstash/ratelimit";

type RateLimitOptions = {
	identifier?: string;
	email?: string;
	errorMessage: string;
	formatTime?: (seconds: number) => string;
};

type RateLimitResult = {
	success: boolean;
	error?: string;
	status?: number;
	waitTimeSeconds?: number;
};

/**
 * Helper function to handle rate limiting in server actions
 * @param ratelimit The ratelimit instance to use
 * @param options Configuration options for rate limiting
 * @returns Result object with success status and error information if rate limited
 */
export const handleRateLimit = async (
	ratelimit: Ratelimit,
	options: RateLimitOptions,
): Promise<RateLimitResult> => {
	const { identifier, email, errorMessage, formatTime } = options;

	const headersList = headers();
	const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

	const rateLimitIdentifier = identifier || (email ? `${ip}:${email}` : `${ip}`);

	try {
		const { success, reset } = await ratelimit.limit(rateLimitIdentifier);

		if (!success) {
			const waitTimeSeconds = Math.ceil((reset - Date.now()) / 1000);

			let timeDisplay: string;
			if (formatTime) {
				timeDisplay = formatTime(waitTimeSeconds);
			} else {
				timeDisplay = `${waitTimeSeconds}s`;
			}

			return {
				success: false,
				error: errorMessage.replace("{time}", timeDisplay),
				status: 429,
				waitTimeSeconds,
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Rate limit error:", error);
		return { success: true };
	}
};
