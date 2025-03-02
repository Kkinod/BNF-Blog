import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

let redis: Redis | undefined;
let commentRatelimit: Ratelimit | undefined;
let loginRatelimit: Ratelimit | undefined;
let registerRatelimit: Ratelimit | undefined;
let resetPasswordRatelimit: Ratelimit | undefined;

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
	if (!commentRatelimit) {
		commentRatelimit = new Ratelimit({
			redis: getRedis(),
			limiter: Ratelimit.slidingWindow(5, "1 m"),
			analytics: true,
			prefix: "ratelimit:comment",
			timeout: 1000,
		});
	}
	return commentRatelimit;
};

export const getLoginRatelimit = () => {
	if (!loginRatelimit) {
		loginRatelimit = new Ratelimit({
			redis: getRedis(),
			limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 prób na 15 minut
			analytics: true,
			prefix: "ratelimit:login",
			timeout: 1000,
		});
	}
	return loginRatelimit;
};

export const getRegisterRatelimit = () => {
	if (!registerRatelimit) {
		registerRatelimit = new Ratelimit({
			redis: getRedis(),
			limiter: Ratelimit.slidingWindow(3, "60 m"), // 3 próby na godzinę
			analytics: true,
			prefix: "ratelimit:register",
			timeout: 1000,
		});
	}
	return registerRatelimit;
};

export const getResetPasswordRatelimit = () => {
	if (!resetPasswordRatelimit) {
		resetPasswordRatelimit = new Ratelimit({
			redis: getRedis(),
			limiter: Ratelimit.slidingWindow(3, "60 m"), // 3 próby na godzinę
			analytics: true,
			prefix: "ratelimit:reset-password",
			timeout: 1000,
		});
	}
	return resetPasswordRatelimit;
};
