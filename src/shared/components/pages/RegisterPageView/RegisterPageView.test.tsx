import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { toast } from "sonner";
import * as registerAction from "../../../../../actions/register";
import * as resendAction from "../../../../../actions/resend-verification";
import { labels } from "../../../../shared/utils/labels";
import { RegisterPageView } from "./RegisterPageView";

jest.mock("sonner");
jest.mock("../../../../../actions/register");
jest.mock("../../../../../actions/resend-verification");

type RegisterSuccess = {
	success: string;
	verification: boolean;
	error?: undefined;
	status?: undefined;
};

type RegisterEmailInUseError = {
	error: string;
	status?: undefined;
	verification?: undefined;
	success?: undefined;
};

type RegisterRateLimitError = {
	error: string;
	status: number;
	verification?: undefined;
	success?: undefined;
};

type _RegisterResponse = RegisterSuccess | RegisterEmailInUseError | RegisterRateLimitError;

describe("RegisterPageView Component", () => {
	const mockRegisterSuccess: RegisterSuccess = {
		success: "Account created successfully",
		verification: true,
	};

	const mockEmailInUseError: RegisterEmailInUseError = {
		error: "Email already in use",
	};

	const mockRateLimitError: RegisterRateLimitError = {
		error: "Too many requests",
		status: 429,
	};

	const validFormData = {
		name: "John Doe",
		email: "test@example.com",
		password: "password123",
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(registerAction.register as jest.Mock).mockResolvedValue(mockRegisterSuccess);
		(resendAction.resendVerificationEmail as jest.Mock).mockResolvedValue({
			success: "Verification email sent",
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("renders the registration form", () => {
		render(<RegisterPageView />);

		expect(screen.getByText(labels.createAnAccount)).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: labels.register })).toBeInTheDocument();
		expect(screen.getByLabelText(labels.name)).toBeInTheDocument();
		expect(screen.getByLabelText(labels.email)).toBeInTheDocument();
		expect(screen.getByLabelText(labels.password)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: labels.register })).toBeInTheDocument();
		expect(screen.getByText(labels.alreadyHaveAnAccount)).toBeInTheDocument();
	});

	it("submits form with valid data", async () => {
		render(<RegisterPageView />);

		const nameInput = screen.getByLabelText(labels.name);
		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		const submitButton = screen.getByRole("button", { name: labels.register });

		fireEvent.change(nameInput, { target: { value: validFormData.name } });
		fireEvent.change(emailInput, { target: { value: validFormData.email } });
		fireEvent.change(passwordInput, { target: { value: validFormData.password } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(registerAction.register).toHaveBeenCalledWith(validFormData);
		});

		await waitFor(() => {
			expect(screen.getByText("Account created successfully")).toBeInTheDocument();
		});
	});

	it("shows error when email is in use", async () => {
		(registerAction.register as jest.Mock).mockResolvedValueOnce(mockEmailInUseError);

		render(<RegisterPageView />);

		const nameInput = screen.getByLabelText(labels.name);
		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		const submitButton = screen.getByRole("button", { name: labels.register });

		fireEvent.change(nameInput, { target: { value: validFormData.name } });
		fireEvent.change(emailInput, { target: { value: validFormData.email } });
		fireEvent.change(passwordInput, { target: { value: validFormData.password } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText("Email already in use")).toBeInTheDocument();
		});
	});

	it("shows toast when rate limit is exceeded", async () => {
		(registerAction.register as jest.Mock).mockResolvedValueOnce(mockRateLimitError);

		render(<RegisterPageView />);

		const nameInput = screen.getByLabelText(labels.name);
		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		const submitButton = screen.getByRole("button", { name: labels.register });

		fireEvent.change(nameInput, { target: { value: validFormData.name } });
		fireEvent.change(emailInput, { target: { value: validFormData.email } });
		fireEvent.change(passwordInput, { target: { value: validFormData.password } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith("Too many requests");
		});
	});

	it("disables form elements during submission", async () => {
		let resolvePromise: (value: unknown) => void;
		const mockRegisterPromise = new Promise((resolve) => {
			resolvePromise = resolve;
		});
		(registerAction.register as jest.Mock).mockReturnValue(mockRegisterPromise);

		render(<RegisterPageView />);

		const nameInput = screen.getByLabelText(labels.name);
		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		const submitButton = screen.getByRole("button", { name: labels.register });

		fireEvent.change(nameInput, { target: { value: validFormData.name } });
		fireEvent.change(emailInput, { target: { value: validFormData.email } });
		fireEvent.change(passwordInput, { target: { value: validFormData.password } });

		fireEvent.click(submitButton);

		resolvePromise!(mockRegisterSuccess);

		await waitFor(() => {
			expect(screen.getByText(labels.pleaseVerifyYourEmail)).toBeInTheDocument();
		});
	});

	it("shows verification view after successful registration", async () => {
		render(<RegisterPageView />);

		const nameInput = screen.getByLabelText(labels.name);
		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		const submitButton = screen.getByRole("button", { name: labels.register });

		fireEvent.change(nameInput, { target: { value: validFormData.name } });
		fireEvent.change(emailInput, { target: { value: validFormData.email } });
		fireEvent.change(passwordInput, { target: { value: validFormData.password } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(labels.pleaseVerifyYourEmail)).toBeInTheDocument();
			expect(screen.getByText(labels.verification)).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: labels.resendVerificationEmail }),
			).toBeInTheDocument();
		});
	});

	it("handles resend verification email", async () => {
		render(<RegisterPageView />);

		const nameInput = screen.getByLabelText(labels.name);
		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		const submitButton = screen.getByRole("button", { name: labels.register });

		fireEvent.change(nameInput, { target: { value: validFormData.name } });
		fireEvent.change(emailInput, { target: { value: validFormData.email } });
		fireEvent.change(passwordInput, { target: { value: validFormData.password } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			const resendButton = screen.getByRole("button", { name: labels.resendVerificationEmail });
			fireEvent.click(resendButton);
		});

		await waitFor(() => {
			expect(resendAction.resendVerificationEmail).toHaveBeenCalledWith(validFormData.email);
			expect(toast.success).toHaveBeenCalledWith(labels.verificationEmailSent);
		});
	});

	it("returns to registration form when back button is clicked", async () => {
		render(<RegisterPageView />);

		const nameInput = screen.getByLabelText(labels.name);
		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		const submitButton = screen.getByRole("button", { name: labels.register });

		fireEvent.change(nameInput, { target: { value: validFormData.name } });
		fireEvent.change(emailInput, { target: { value: validFormData.email } });
		fireEvent.change(passwordInput, { target: { value: validFormData.password } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			const backButton = screen.getByRole("button", { name: labels.backToRegister });
			fireEvent.click(backButton);
		});

		await waitFor(() => {
			expect(screen.getByText(labels.createAnAccount)).toBeInTheDocument();
			expect(screen.queryByText(labels.verification)).not.toBeInTheDocument();
		});
	});

	it("validates required fields", async () => {
		render(<RegisterPageView />);

		const submitButton = screen.getByRole("button", { name: labels.register });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(registerAction.register).not.toHaveBeenCalled();
		});
	});

	it("clears form after successful registration without verification", async () => {
		(registerAction.register as jest.Mock).mockResolvedValueOnce({
			success: "Account created successfully",
			verification: false,
		});

		render(<RegisterPageView />);

		const nameInput = screen.getByLabelText(labels.name);
		const emailInput = screen.getByLabelText(labels.email);
		const passwordInput = screen.getByLabelText(labels.password);
		const submitButton = screen.getByRole("button", { name: labels.register });

		fireEvent.change(nameInput, { target: { value: validFormData.name } });
		fireEvent.change(emailInput, { target: { value: validFormData.email } });
		fireEvent.change(passwordInput, { target: { value: validFormData.password } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(nameInput).toHaveValue("");
			expect(emailInput).toHaveValue("");
			expect(passwordInput).toHaveValue("");
		});
	});
});
