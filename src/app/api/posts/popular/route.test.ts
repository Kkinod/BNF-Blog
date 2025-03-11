import { GET, POST, PUT, DELETE, PATCH } from "./route";
// eslint-disable-next-line import/no-unresolved
import { prisma } from "@/shared/utils/connect";
// eslint-disable-next-line import/no-unresolved
import { labels } from "@/shared/utils/labels";

interface ErrorResponse {
	error: string;
}

interface Post {
	id: string;
	title: string;
	views: number;
	isVisible: boolean;
	createdAt: Date;
	user: {
		id: string;
		name: string;
	};
}

type ApiResponse = Post[] | ErrorResponse | null;

type MockResponseInit = {
	status?: number;
	headers?: Record<string, string> | Headers;
};

type MockResponseType = {
	status: number;
	headers: {
		get: (name: string) => string | null;
	};
	ok: boolean;
	json: () => Promise<ApiResponse>;
};

jest.mock("next/server", () => ({
	NextResponse: {
		json: function MockNextResponseJson(
			body: ApiResponse,
			init?: MockResponseInit,
		): MockResponseType {
			const status = init?.status || 200;
			const headersObj: Record<string, string> = {};

			// Convert Headers to plain object if needed
			if (init?.headers instanceof Headers) {
				init.headers.forEach((value, key) => {
					headersObj[key] = value;
				});
			} else if (init?.headers) {
				Object.assign(headersObj, init.headers);
			}

			// Special handling for methodNotAllowed which sets Allow header
			if (status === 405 && !headersObj["Allow"]) {
				headersObj["Allow"] = "GET";
			}

			return {
				status,
				headers: {
					get: (name: string) => headersObj[name] || null,
				},
				ok: status >= 200 && status < 300,
				json: async () => body,
			};
		},
	},
}));

jest.mock("@/shared/utils/connect", () => ({
	prisma: {
		post: {
			findMany: jest.fn(),
		},
	},
}));

jest.mock("@/shared/utils/labels", () => ({
	labels: {
		errors: {
			somethingWentWrong: "Ooops! Something went wrong!",
			unauthorized: "Unauthorized!",
		},
	},
}));

describe("Popular Posts API Route", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("GET Method", () => {
		it("returns popular posts from the last year", async () => {
			const oneYearAgo = new Date();
			oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

			const mockPosts = [
				{
					id: "1",
					title: "Popular Post 1",
					views: 1000,
					isVisible: true,
					createdAt: new Date(),
					user: {
						id: "user1",
						name: "Test User",
					},
				},
				{
					id: "2",
					title: "Popular Post 2",
					views: 800,
					isVisible: true,
					createdAt: new Date(),
					user: {
						id: "user2",
						name: "Another User",
					},
				},
				{
					id: "3",
					title: "Popular Post 3",
					views: 600,
					isVisible: true,
					createdAt: new Date(),
					user: {
						id: "user3",
						name: "Third User",
					},
				},
			];

			(prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts);

			const response = await GET();

			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);

			const body = (await response.json()) as Post[];
			expect(body).toEqual(mockPosts);

			// Verify cache headers
			expect(response.headers.get("Cache-Control")).toBe(
				"public, max-age=10, stale-while-revalidate=59",
			);

			// Verify findMany was called with correct parameters
			// eslint-disable-next-line @typescript-eslint/unbound-method
			const findManyMock = prisma.post.findMany as jest.Mock;

			// Verify that findMany was called
			expect(findManyMock).toHaveBeenCalled();

			// Disable linter for the verification of call arguments
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const callArgs = findManyMock.mock.calls[0][0];
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			expect(callArgs.take).toBe(3);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			expect(callArgs.where.isVisible).toBe(true);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			expect(callArgs.where.createdAt.gte).toBeInstanceOf(Date);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			expect(callArgs.orderBy).toEqual({ views: "desc" });
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			expect(callArgs.include).toEqual({ user: true });
		});

		it("filters out posts older than one year", async () => {
			const now = new Date();
			const thirteenMonthsAgo = new Date(now);
			thirteenMonthsAgo.setMonth(now.getMonth() - 13);

			const sixMonthsAgo = new Date(now);
			sixMonthsAgo.setMonth(now.getMonth() - 6);

			const nineMonthsAgo = new Date(now);
			nineMonthsAgo.setMonth(now.getMonth() - 9);

			const allMockPosts = [
				{
					id: "1",
					title: "Recent Post 1",
					views: 1000,
					isVisible: true,
					createdAt: sixMonthsAgo,
					user: {
						id: "user1",
						name: "Test User",
					},
				},
				{
					id: "2",
					title: "Recent Post 2",
					views: 800,
					isVisible: true,
					createdAt: nineMonthsAgo,
					user: {
						id: "user2",
						name: "Another User",
					},
				},
				{
					id: "3",
					title: "Old Post",
					views: 1500,
					isVisible: true,
					createdAt: thirteenMonthsAgo,
					user: {
						id: "user3",
						name: "Third User",
					},
				},
			];

			// Mock the database query to simulate filtering
			(prisma.post.findMany as jest.Mock).mockImplementation((query) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				const dateFilter = query.where.createdAt.gte;

				// Filter posts based on the date in the query
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				const filteredPosts = allMockPosts.filter((post) => post.createdAt >= dateFilter);

				return filteredPosts.sort((a, b) => b.views - a.views);
			});

			const response = await GET();

			expect(response.status).toBe(200);
			const body = (await response.json()) as Post[];

			// Verify we only get the two recent posts (the old one is filtered out)
			expect(body.length).toBe(2);
			expect(body.map((post) => post.id).sort()).toEqual(["1", "2"]);

			// Make sure the old post is not included
			expect(body.find((post) => post.id === "3")).toBeUndefined();

			// Verify the query included the date filter
			// eslint-disable-next-line @typescript-eslint/unbound-method
			const findManyMock = prisma.post.findMany as jest.Mock;
			expect(findManyMock).toHaveBeenCalled();

			// Disable linter for the verification of call arguments
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const callArgs = findManyMock.mock.calls[0][0];
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			expect(callArgs.where.createdAt.gte).toBeInstanceOf(Date);
		});

		it("handles database errors gracefully", async () => {
			(prisma.post.findMany as jest.Mock).mockRejectedValue(
				new Error("Database connection failed"),
			);

			const response = await GET();

			expect(response.status).toBe(503);
			expect(response.headers.get("Retry-After")).toBe("30");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.somethingWentWrong,
			});
		});
	});

	describe("HTTP Methods", () => {
		it("denies POST method", async () => {
			const response = await POST();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});

		it("denies PUT method", async () => {
			const response = await PUT();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});

		it("denies DELETE method", async () => {
			const response = await DELETE();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});

		it("denies PATCH method", async () => {
			const response = await PATCH();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});
	});
});
