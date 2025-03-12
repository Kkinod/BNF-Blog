import type { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";
import { GET, POST, PUT, DELETE, PATCH, type CommentRequestBody } from "./route";
import { prisma } from "@/shared/utils/connect";
import { labels } from "@/shared/utils/labels";
import { currentUser, currentRole } from "@/features/auth/utils/currentUser";
import { getCommentRatelimit } from "@/features/auth/utils/ratelimit";
import { handleRateLimit } from "@/features/auth/utils/rateLimitHelper";
import { COMMENT_LIMITS } from "@/config/constants";

interface ErrorResponse {
	error: string;
}

interface Comment {
	id: string;
	desc: string;
	userEmail: string;
	postSlug: string;
	createdAt: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
}

type ApiResponse = Comment[] | Comment | ErrorResponse | null;

type MockResponseInit = {
	status?: number;
	headers?: Headers;
};

type MockResponseType = {
	status: number;
	headers: Headers;
	ok: boolean;
	json: () => Promise<ApiResponse>;
};

// Simplified mock interface that only includes what we need for tests
interface MockNextRequest {
	json: () => Promise<CommentRequestBody>;
}

jest.mock("next/server", () => ({
	NextResponse: {
		json: function MockNextResponseJson(
			body: ApiResponse,
			init?: MockResponseInit,
		): MockResponseType {
			const status = init?.status || 200;
			const headers = init?.headers || new Headers();

			return {
				status,
				headers,
				ok: status >= 200 && status < 300,
				json: async () => body,
			};
		},
	},
}));

jest.mock("@/shared/utils/connect", () => ({
	prisma: {
		comment: {
			findMany: jest.fn(),
			create: jest.fn(),
		},
	},
}));

jest.mock("@/features/auth/utils/currentUser", () => ({
	currentUser: jest.fn(),
	currentRole: jest.fn(),
}));

jest.mock("@/features/auth/utils/ratelimit", () => ({
	getCommentRatelimit: jest.fn(),
}));

jest.mock("@/features/auth/utils/rateLimitHelper", () => ({
	handleRateLimit: jest.fn(),
}));

jest.mock("xss", () => jest.fn().mockImplementation((input: string) => input));

jest.mock("@/shared/utils/labels", () => ({
	labels: {
		errors: {
			somethingWentWrong: "Ooops! Something went wrong!",
			unauthorized: "Unauthorized!",
			invalidCredentials: "Invalid credentials",
			youDoNoteHavePermissionToViewThisContent: "You do not have permission",
		},
		rateLimitExceeded: "Rate limit exceeded",
		commentEmpty: "Comment is empty",
		commentTooLong: "Comment is too long",
	},
}));

jest.mock("@/config/constants", () => ({
	COMMENT_LIMITS: {
		MAX_LENGTH: 500,
	},
}));

describe("Comments API Route", () => {
	let mockRequest: Request;
	let mockNextRequest: MockNextRequest;

	beforeEach(() => {
		jest.clearAllMocks();

		mockRequest = {
			url: "http://localhost:3000/api/comments?postSlug=test-post",
		} as unknown as Request;

		// Create a simple mock that only has the json method we need
		mockNextRequest = {
			json: jest.fn().mockResolvedValue({
				postSlug: "test-post",
				desc: "This is a test comment",
			}),
		};
	});

	describe("GET Method", () => {
		it("returns comments when found", async () => {
			const mockComments = [
				{
					id: "1",
					desc: "Test comment",
					userEmail: "test@example.com",
					postSlug: "test-post",
					createdAt: new Date().toISOString(),
					user: {
						id: "user1",
						name: "Test User",
						email: "test@example.com",
					},
				},
			];

			(prisma.comment.findMany as jest.Mock).mockResolvedValue(mockComments);

			const response = await GET(mockRequest);

			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);

			const body = (await response.json()) as Comment[];
			expect(body).toEqual(mockComments);
		});

		it("handles database errors gracefully", async () => {
			(prisma.comment.findMany as jest.Mock).mockRejectedValue(
				new Error("Database connection failed"),
			);

			const response = await GET(mockRequest);

			expect(response.status).toBe(503);
			if (typeof response.headers.get === "function") {
				expect(response.headers.get("Retry-After")).toBe("30");
			}

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.somethingWentWrong,
			});
		});
	});

	describe("POST Method", () => {
		it("creates a comment when authenticated as ADMIN", async () => {
			const mockUser = { email: "admin@example.com" };
			const mockComment = {
				id: "1",
				desc: "This is a test comment",
				userEmail: "admin@example.com",
				postSlug: "test-post",
				createdAt: new Date().toISOString(),
			};

			(currentUser as jest.Mock).mockResolvedValue(mockUser);
			(currentRole as jest.Mock).mockResolvedValue(UserRole.ADMIN);
			(getCommentRatelimit as jest.Mock).mockReturnValue({});
			(handleRateLimit as jest.Mock).mockResolvedValue({ success: true });
			(prisma.comment.create as jest.Mock).mockResolvedValue(mockComment);

			const response = await POST(mockNextRequest as unknown as NextRequest);

			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);

			const body = (await response.json()) as Comment;
			expect(body).toEqual(mockComment);
		});

		it("returns 401 when not authenticated", async () => {
			(currentUser as jest.Mock).mockResolvedValue(null);

			const response = await POST(mockNextRequest as unknown as NextRequest);

			expect(response.status).toBe(401);
			expect(response.ok).toBe(false);

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.invalidCredentials,
			});
		});

		it("creates a comment when authenticated as USER", async () => {
			const mockUser = { email: "user@example.com" };
			const mockComment = {
				id: "1",
				desc: "This is a test comment",
				userEmail: "user@example.com",
				postSlug: "test-post",
				createdAt: new Date().toISOString(),
			};

			(currentUser as jest.Mock).mockResolvedValue(mockUser);
			(currentRole as jest.Mock).mockResolvedValue(UserRole.USER);
			(getCommentRatelimit as jest.Mock).mockReturnValue({});
			(handleRateLimit as jest.Mock).mockResolvedValue({ success: true });
			(prisma.comment.create as jest.Mock).mockResolvedValue(mockComment);

			const response = await POST(mockNextRequest as unknown as NextRequest);

			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);

			const body = (await response.json()) as Comment;
			expect(body).toEqual(mockComment);
		});

		it("returns 429 when rate limited", async () => {
			(currentUser as jest.Mock).mockResolvedValue({ email: "admin@example.com" });
			(currentRole as jest.Mock).mockResolvedValue(UserRole.ADMIN);
			(getCommentRatelimit as jest.Mock).mockReturnValue({});
			(handleRateLimit as jest.Mock).mockResolvedValue({
				success: false,
				error: labels.rateLimitExceeded,
				waitTimeSeconds: 60,
			});

			const response = await POST(mockNextRequest as unknown as NextRequest);

			expect(response.status).toBe(429);
			expect(response.ok).toBe(false);
			if (typeof response.headers.get === "function") {
				expect(response.headers.get("Retry-After")).toBe("60");
			}

			const body = (await response.json()) as ErrorResponse;
			expect(body).toHaveProperty("error", labels.rateLimitExceeded);
			expect(body).toHaveProperty("waitTimeSeconds", 60);
		});

		it("returns 400 when comment is empty", async () => {
			(currentUser as jest.Mock).mockResolvedValue({ email: "admin@example.com" });
			(currentRole as jest.Mock).mockResolvedValue(UserRole.ADMIN);
			(getCommentRatelimit as jest.Mock).mockReturnValue({});
			(handleRateLimit as jest.Mock).mockResolvedValue({ success: true });
			(mockNextRequest.json as jest.Mock).mockResolvedValue({
				postSlug: "test-post",
				desc: "",
			});

			const response = await POST(mockNextRequest as unknown as NextRequest);

			expect(response.status).toBe(400);
			expect(response.ok).toBe(false);

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.commentEmpty,
			});
		});

		it("returns 400 when comment is too long", async () => {
			(currentUser as jest.Mock).mockResolvedValue({ email: "admin@example.com" });
			(currentRole as jest.Mock).mockResolvedValue(UserRole.ADMIN);
			(getCommentRatelimit as jest.Mock).mockReturnValue({});
			(handleRateLimit as jest.Mock).mockResolvedValue({ success: true });
			(mockNextRequest.json as jest.Mock).mockResolvedValue({
				postSlug: "test-post",
				desc: "a".repeat(COMMENT_LIMITS.MAX_LENGTH + 1),
			});

			const response = await POST(mockNextRequest as unknown as NextRequest);

			expect(response.status).toBe(400);
			expect(response.ok).toBe(false);

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.commentTooLong,
			});
		});
	});

	describe("HTTP Methods", () => {
		it("denies PUT method", async () => {
			const response = await PUT();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET, POST");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});

		it("denies DELETE method", async () => {
			const response = await DELETE();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET, POST");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});

		it("denies PATCH method", async () => {
			const response = await PATCH();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET, POST");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});
	});
});
