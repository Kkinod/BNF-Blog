import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Singleton pattern dla Redis connection
let redis: Redis | undefined;
let ratelimit: Ratelimit | undefined;

const getRedis = () => {
	if (!redis) {
		redis = new Redis({
			url: process.env.UPSTASH_REDIS_URL || "",
			token: process.env.UPSTASH_REDIS_TOKEN || "",
		});
	}
	return redis;
};

export const getRatelimit = () => {
	if (!ratelimit) {
		ratelimit = new Ratelimit({
			redis: getRedis(),
			limiter: Ratelimit.slidingWindow(1, "1 m"),
			analytics: true,
			prefix: "ratelimit:comment",
			timeout: 1000, // 1 second timeout
		});
	}
	return ratelimit;
};
