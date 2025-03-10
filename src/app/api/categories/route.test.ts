import { GET, POST, PUT, DELETE, PATCH, type Category } from "./route";
// eslint-disable-next-line import/no-unresolved
import { prisma } from "@/shared/utils/connect";
// eslint-disable-next-line import/no-unresolved
import { labels } from "@/shared/utils/labels";

interface ErrorResponse {
	error: string;
}

type ApiResponse = Category[] | ErrorResponse | null;

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
		category: {
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

describe("Categories API Route", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("GET Method", () => {
		it("returns categories when found", async () => {
			const mockCategories = [
				{
					id: "1",
					slug: "technology",
					title: "Technology",
					img: "tech.jpg",
				},
				{
					id: "2",
					slug: "lifestyle",
					title: "Lifestyle",
					img: "lifestyle.jpg",
				},
			];

			(prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

			const response = await GET();

			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);

			const body = (await response.json()) as Category[];
			expect(body).toEqual(mockCategories);
		});

		it("returns empty array when no categories found", async () => {
			(prisma.category.findMany as jest.Mock).mockResolvedValue([]);

			const response = await GET();

			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);

			const body = (await response.json()) as Category[];
			expect(body).toEqual([]);
		});

		it("handles database errors gracefully", async () => {
			(prisma.category.findMany as jest.Mock).mockRejectedValue(
				new Error("Database connection failed"),
			);

			const response = await GET();

			expect(response.status).toBe(503);
			if (typeof response.headers.get === "function") {
				expect(response.headers.get("Retry-After")).toBe("30");
			}

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.somethingWentWrong,
			});
		});

		it("handles unexpected errors", async () => {
			(prisma.category.findMany as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

			const response = await GET();

			expect(response.status).toBe(500);

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
