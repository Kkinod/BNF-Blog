import { renderHook } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "./useCurrentUser";

jest.mock("next-auth/react", () => ({
	useSession: jest.fn(),
}));

describe("useCurrentUser", () => {
	// Test when user data is available
	it("should return the user data when available", () => {
		// Setup mock to return a session with user data
		(useSession as jest.Mock).mockReturnValue({
			data: {
				user: {
					id: "user123",
					name: "Test User",
					email: "test@example.com",
					role: "USER",
				},
			},
		});

		const { result } = renderHook(() => useCurrentUser());

		expect(result.current).toEqual({
			id: "user123",
			name: "Test User",
			email: "test@example.com",
			role: "USER",
		});
	});

	// Test when there is no user
	it("should return undefined when there is no user", () => {
		// Setup mock to return a session without user data
		(useSession as jest.Mock).mockReturnValue({
			data: {},
		});

		const { result } = renderHook(() => useCurrentUser());

		expect(result.current).toBeUndefined();
	});

	// Test when there is no session data
	it("should return undefined when there is no session data", () => {
		// Setup mock to return no session data
		(useSession as jest.Mock).mockReturnValue({
			data: null,
		});

		const { result } = renderHook(() => useCurrentUser());

		expect(result.current).toBeUndefined();
	});

	// Test when session is loading
	it("should return undefined when session is loading", () => {
		// Setup mock to simulate loading state
		(useSession as jest.Mock).mockReturnValue({
			status: "loading",
			data: undefined,
		});

		const { result } = renderHook(() => useCurrentUser());

		expect(result.current).toBeUndefined();
	});
});
