import { UserRole } from "@prisma/client";
import { GET, POST, PUT, DELETE, PATCH } from "./route";
import { currentRole } from "@/features/auth/utils/currentUser";
import { labels } from "@/shared/utils/labels";

interface ErrorResponse {
	error: string;
}

interface SuccessResponse {
	authorized: boolean;
	message: string;
}

type ApiResponse = ErrorResponse | SuccessResponse | null;

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

jest.mock("@/features/auth/utils/currentUser", () => ({
	currentRole: jest.fn(),
}));

class MockRequest implements Request {
	public headers: Headers;
	public method: string;
	public url = "http://localhost:3000";
	public body: ReadableStream | null = null;
	public bodyUsed = false;
	public cache = "default" as RequestCache;
	public credentials = "same-origin" as RequestCredentials;
	public destination = "" as RequestDestination;
	public integrity = "";
	public keepalive = false;
	public mode = "cors" as RequestMode;
	public redirect = "follow" as RequestRedirect;
	public referrer = "";
	public referrerPolicy = "no-referrer" as ReferrerPolicy;
	public signal = new AbortController().signal;

	constructor(method: string = "GET", headers: Record<string, string> = {}) {
		this.method = method;
		this.headers = new Headers(headers);
	}

	// Stub methods
	arrayBuffer(): Promise<ArrayBuffer> {
		return Promise.reject("Not implemented");
	}
	blob(): Promise<Blob> {
		return Promise.reject("Not implemented");
	}
	clone(): Request {
		return this;
	}
	formData(): Promise<FormData> {
		return Promise.reject("Not implemented");
	}
	json(): Promise<unknown> {
		return Promise.reject("Not implemented");
	}
	text(): Promise<string> {
		return Promise.reject("Not implemented");
	}
	bytes(): Promise<Uint8Array> {
		return Promise.reject("Not implemented");
	}
}

describe("Admin API Route", () => {
	const createRequest = (method: string = "GET", headers: Record<string, string> = {}) => {
		return new MockRequest(method, headers);
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Authorization", () => {
		it("allows ADMIN access", async () => {
			(currentRole as jest.Mock).mockResolvedValue(UserRole.ADMIN);
			const response = await GET(createRequest());

			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);

			const body = (await response.json()) as SuccessResponse;
			expect(body).toEqual({
				authorized: true,
				message: labels.adminOnlyApiRoute,
			});
		});

		it("denies USER access", async () => {
			(currentRole as jest.Mock).mockResolvedValue(UserRole.USER);
			const response = await GET(createRequest());

			expect(response.status).toBe(403);
			expect(response.ok).toBe(false);

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.youDoNoteHavePermissionToViewThisContent,
			});
		});

		it("denies unauthenticated access", async () => {
			(currentRole as jest.Mock).mockResolvedValue(undefined);
			const response = await GET(createRequest());

			expect(response.status).toBe(403);
			expect(response.ok).toBe(false);

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.youDoNoteHavePermissionToViewThisContent,
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

	describe("Error Handling", () => {
		it("handles database errors gracefully", async () => {
			(currentRole as jest.Mock).mockRejectedValue(new Error("Database connection failed"));
			const response = await GET(createRequest());

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
			(currentRole as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
			const response = await GET(createRequest());

			expect(response.status).toBe(500);

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.somethingWentWrong,
			});
		});
	});
});
