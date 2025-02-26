import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
	url: process.env.UPSTASH_REDIS_URL || "",
	token: process.env.UPSTASH_REDIS_TOKEN || "",
});

export const commentRatelimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(2, "1 m"),
	analytics: true,
	prefix: "ratelimit:comment",
});
