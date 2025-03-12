import { renderHook, act } from "@testing-library/react";
import { toast } from "sonner";
import { login } from "../../../actions/login";
import { useTwoFactorAuth } from "./useTwoFactorAuth";

jest.mock("sonner", () => ({
	toast: {
		error: jest.fn(),
		success: jest.fn(),
	},
}));

jest.mock("../../../actions/login", () => ({
	login: jest.fn(),
}));

jest.mock("../../shared/utils/labels", () => ({
	labels: {
		errors: {
			somethingWentWrong: "Something went wrong",
			emailIsRequired: "Email is required",
		},
		twoFactorCodeResent: "2FA code resent",
	},
}));

// Create a mock that can be customized per test
const mockTimeCounter = {
	timeRemaining: 0,
	isExpired: true,
	formatTime: (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	},
};

jest.mock("./useTimeCounter", () => ({
	useTimeCounter: () => mockTimeCounter,
}));

const mockDateNow = jest.fn(() => 1000000000000);
global.Date.now = mockDateNow;

describe("useTwoFactorAuth", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Reset mock values for each test
		mockTimeCounter.timeRemaining = 0;
		mockTimeCounter.isExpired = true;
	});

	it("should initialize with default values", () => {
		const { result } = renderHook(() => useTwoFactorAuth());

		expect(result.current.showTwoFactor).toBe(false);
		expect(result.current.expiresAt).toBeNull();
		expect(result.current.timeRemaining).toBe(0);
		expect(result.current.isExpired).toBe(true);
	});

	it("should start two factor auth", () => {
		// Set mock values for this test
		mockTimeCounter.isExpired = false;

		const { result } = renderHook(() => useTwoFactorAuth());
		const expiresAt = Date.now() + 300000; // 5 minutes from now

		act(() => {
			result.current.startTwoFactorAuth(expiresAt);
		});

		expect(result.current.showTwoFactor).toBe(true);
		expect(result.current.expiresAt).toBe(expiresAt);
		expect(result.current.isExpired).toBe(false);
	});

	it("should format time correctly", () => {
		const { result } = renderHook(() => useTwoFactorAuth());

		expect(result.current.formatTime(65)).toBe("01:05");
		expect(result.current.formatTime(3600)).toBe("60:00");
		expect(result.current.formatTime(0)).toBe("00:00");
	});

	it("should not resend code if not expired", () => {
		// Set mock values for this test
		mockTimeCounter.isExpired = false;

		const { result } = renderHook(() => useTwoFactorAuth());

		act(() => {
			result.current.handleResendCode("test@example.com", "password");
		});

		expect(login).not.toHaveBeenCalled();
	});

	it("should not resend code if email or password is missing", async () => {
		const { result } = renderHook(() => useTwoFactorAuth());

		act(() => {
			result.current.handleResendCode();
		});

		expect(login).not.toHaveBeenCalled();
		expect(toast.error).toHaveBeenCalledWith("Email is required");
	});

	it("should handle resend code success", async () => {
		const { result } = renderHook(() => useTwoFactorAuth());
		const expiresAt = Date.now() + 300000; // 5 minutes from now

		(login as jest.Mock).mockResolvedValue({
			twoFactor: true,
			expiresAt,
		});

		await act(async () => {
			result.current.handleResendCode("test@example.com", "password");
		});

		expect(login).toHaveBeenCalledWith({
			email: "test@example.com",
			password: "password",
			code: "",
		});
		expect(result.current.expiresAt).toBe(expiresAt);
		expect(toast.success).toHaveBeenCalledWith("2FA code resent");
	});

	it("should handle resend code error", async () => {
		const { result } = renderHook(() => useTwoFactorAuth());

		(login as jest.Mock).mockResolvedValue({
			error: "Invalid credentials",
		});

		await act(async () => {
			result.current.handleResendCode("test@example.com", "password");
		});

		expect(login).toHaveBeenCalledWith({
			email: "test@example.com",
			password: "password",
			code: "",
		});
		expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
	});

	it("should handle resend code exception", async () => {
		const { result } = renderHook(() => useTwoFactorAuth());

		(login as jest.Mock).mockRejectedValue(new Error("Network error"));

		await act(async () => {
			result.current.handleResendCode("test@example.com", "password");
		});

		expect(login).toHaveBeenCalledWith({
			email: "test@example.com",
			password: "password",
			code: "",
		});
		expect(toast.error).toHaveBeenCalledWith("Something went wrong");
	});
});
