import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { toast } from "sonner";
import * as loginAction from "../../../../../actions/login";
import { labels } from "../../../../shared/utils/labels";
import { LoginPageView } from "./LoginPageView";

jest.mock("sonner");
jest.mock("../../../../../actions/login");

type LoginSuccess = {
	success: string;
	error?: undefined;
	twoFactor?: undefined;
	expiresAt?: undefined;
};

type LoginError = {
	error: string;
	success?: undefined;
	twoFactor?: undefined;
	expiresAt?: undefined;
};

type LoginTwoFactor = {
	twoFactor: boolean;
	expiresAt: number;
	success?: undefined;
	error?: undefined;
};

type _LoginResponse = LoginSuccess | LoginError | LoginTwoFactor;

describe("LoginPageView Component", () => {
	const mockSuccess = "Logged in successfully";
	const mockError = "Invalid credentials";
	const validEmail = "test@example.com";
	const validPassword = "password123";
	const validCode = "123456";

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("renders the login form", () => {
		render(<LoginPageView />);

		expect(screen.getByText(labels.welcomeBack)).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: labels.login })).toBeInTheDocument();
		expect(screen.getByLabelText(labels.email)).toBeInTheDocument();
		expect(screen.getByLabelText(labels.password)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: labels.login })).toBeInTheDocument();
		expect(screen.getByText(labels.forgotPassword)).toBeInTheDocument();
	});

	it("submits form with valid credentials", async () => {
		(loginAction.login as jest.Mock).mockResolvedValue({
			success: mockSuccess,
		} as LoginSuccess);

		render(<LoginPageView />);

		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		const submitButton = screen.getByRole("button", { name: labels.login });

		fireEvent.change(emailInput, { target: { value: validEmail } });
		fireEvent.change(passwordInput, { target: { value: validPassword } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(mockSuccess);
		});

		expect(loginAction.login).toHaveBeenCalledWith({
			email: validEmail,
			password: validPassword,
			code: "",
		});
	});

	it("displays error message on invalid credentials", async () => {
		(loginAction.login as jest.Mock).mockResolvedValue({
			error: mockError,
		} as LoginError);

		render(<LoginPageView />);

		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		const submitButton = screen.getByRole("button", { name: labels.login });

		fireEvent.change(emailInput, { target: { value: validEmail } });
		fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(mockError);
		});
	});

	it("handles two factor authentication flow", async () => {
		const expiresAt = Date.now() + 300000; // 5 minutes from now

		(loginAction.login as jest.Mock)
			.mockResolvedValueOnce({
				twoFactor: true,
				expiresAt,
			} as LoginTwoFactor)
			.mockResolvedValueOnce({
				success: mockSuccess,
			} as LoginSuccess);

		render(<LoginPageView />);

		// First step: email and password
		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		let submitButton = screen.getByRole("button", { name: labels.login });

		fireEvent.change(emailInput, { target: { value: validEmail } });
		fireEvent.change(passwordInput, { target: { value: validPassword } });
		fireEvent.click(submitButton);

		// Check if 2FA form is shown
		await waitFor(() => {
			expect(screen.getByLabelText(labels.twoFactorCode)).toBeInTheDocument();
			expect(toast.info).toHaveBeenCalledWith(labels.twoFactorCodeSent);
		});

		// Second step: 2FA code
		const codeInput = screen.getByLabelText(labels.twoFactorCode);
		submitButton = screen.getByRole("button", { name: labels.confirm });

		fireEvent.change(codeInput, { target: { value: validCode } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(mockSuccess);
		});
	});

	it("shows timer for 2FA code expiration", async () => {
		const expiresAt = Date.now() + 300000; // 5 minutes from now

		(loginAction.login as jest.Mock).mockResolvedValue({
			twoFactor: true,
			expiresAt,
		} as LoginTwoFactor);

		render(<LoginPageView />);

		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		const submitButton = screen.getByRole("button", { name: labels.login });

		fireEvent.change(emailInput, { target: { value: validEmail } });
		fireEvent.change(passwordInput, { target: { value: validPassword } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(labels.twoFactorCodeExpires, { exact: false })).toBeInTheDocument();
		});
	});

	it("allows resending 2FA code when expired", async () => {
		const initialExpiresAt = Date.now() - 1000; // Already expired
		const newExpiresAt = Date.now() + 300000; // 5 minutes from now

		(loginAction.login as jest.Mock)
			.mockResolvedValueOnce({
				twoFactor: true,
				expiresAt: initialExpiresAt,
			} as LoginTwoFactor)
			.mockResolvedValueOnce({
				twoFactor: true,
				expiresAt: newExpiresAt,
			} as LoginTwoFactor);

		render(<LoginPageView />);

		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		const loginButton = screen.getByRole("button", { name: labels.login });

		fireEvent.change(emailInput, { target: { value: validEmail } });
		fireEvent.change(passwordInput, { target: { value: validPassword } });
		fireEvent.click(loginButton);

		await waitFor(() => {
			expect(screen.getByText(labels.twoFactorCodeExpired)).toBeInTheDocument();
			const resendButton = screen.getByRole("button", { name: labels.twoFactorResendCode });
			expect(resendButton).toBeInTheDocument();
			expect(resendButton).not.toBeDisabled();
		});

		const resendButton = screen.getByRole("button", { name: labels.twoFactorResendCode });
		fireEvent.click(resendButton);

		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(labels.twoFactorCodeResent);
		});
	});

	it("validates required fields", async () => {
		render(<LoginPageView />);

		const submitButton = screen.getByRole("button", { name: labels.login });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(labels.errors.emailIsRequired)).toBeInTheDocument();
			expect(screen.getByText(labels.errors.passwordIsRequired)).toBeInTheDocument();
		});

		expect(loginAction.login).not.toHaveBeenCalled();
	});

	it("handles successful login correctly", async () => {
		const mockLoginPromise = Promise.resolve({ success: mockSuccess } as LoginSuccess);
		(loginAction.login as jest.Mock).mockReturnValue(mockLoginPromise);

		render(<LoginPageView />);

		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		const form = screen.getByTestId("login-form");

		fireEvent.change(emailInput, { target: { value: validEmail } });
		fireEvent.change(passwordInput, { target: { value: validPassword } });

		fireEvent.submit(form);

		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith(mockSuccess);
		});

		expect(loginAction.login).toHaveBeenCalledWith({
			email: validEmail,
			password: validPassword,
			code: "",
		});
	});
});
