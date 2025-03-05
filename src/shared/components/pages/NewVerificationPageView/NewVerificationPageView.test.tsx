import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSearchParams } from "next/navigation";
import * as newVerificationAction from "../../../../../actions/new-verification";
import { labels } from "../../../../shared/utils/labels";
import { NewVerificationPageView } from "./NewVerificationPageView";

jest.mock("next/navigation", () => ({
	useSearchParams: jest.fn(),
}));

jest.mock("../../../../../actions/new-verification");

type VerificationSuccess = {
	success: string;
	error?: undefined;
};

type VerificationError = {
	error: string;
	success?: undefined;
};

type _VerificationResponse = VerificationSuccess | VerificationError;

describe("NewVerificationPageView Component", () => {
	const mockToken = "valid-token";
	const mockSuccess = "Email verified successfully";
	const mockError = "Invalid token";

	beforeEach(() => {
		jest.clearAllMocks();
		(useSearchParams as jest.Mock).mockReturnValue({
			get: jest.fn().mockReturnValue(mockToken),
		});
	});

	it("renders verification page with loading state", () => {
		(newVerificationAction.newVerification as jest.Mock).mockResolvedValue({
			success: mockSuccess,
		});

		render(<NewVerificationPageView />);

		expect(screen.getByText(labels.errors.confirmYourVerification)).toBeInTheDocument();
		expect(screen.getByText(labels.verification)).toBeInTheDocument();
		expect(screen.getByText(labels.backToLogin)).toBeInTheDocument();
	});

	it("handles successful verification", async () => {
		(newVerificationAction.newVerification as jest.Mock).mockResolvedValue({
			success: mockSuccess,
		} as VerificationSuccess);

		render(<NewVerificationPageView />);

		await waitFor(() => {
			expect(screen.getByText(mockSuccess)).toBeInTheDocument();
		});

		expect(newVerificationAction.newVerification).toHaveBeenCalledWith(mockToken);
	});

	it("handles verification error", async () => {
		(newVerificationAction.newVerification as jest.Mock).mockResolvedValue({
			error: mockError,
		} as VerificationError);

		render(<NewVerificationPageView />);

		await waitFor(() => {
			expect(screen.getByText(mockError)).toBeInTheDocument();
		});

		expect(newVerificationAction.newVerification).toHaveBeenCalledWith(mockToken);
	});

	it("handles missing token", () => {
		(useSearchParams as jest.Mock).mockReturnValue({
			get: jest.fn().mockReturnValue(null),
		});

		render(<NewVerificationPageView />);

		expect(screen.getByText(labels.errors.missingToken)).toBeInTheDocument();
		expect(newVerificationAction.newVerification).not.toHaveBeenCalled();
	});

	it("handles unexpected error during verification", async () => {
		(newVerificationAction.newVerification as jest.Mock).mockRejectedValue(
			new Error("Unexpected error"),
		);

		render(<NewVerificationPageView />);

		await waitFor(() => {
			expect(screen.getByText(labels.errors.somethingWentWrong)).toBeInTheDocument();
		});
	});

	it("prevents multiple verification attempts", async () => {
		(newVerificationAction.newVerification as jest.Mock).mockResolvedValue({
			success: mockSuccess,
		} as VerificationSuccess);

		render(<NewVerificationPageView />);

		await waitFor(() => {
			expect(screen.getByText(mockSuccess)).toBeInTheDocument();
		});

		expect(newVerificationAction.newVerification).toHaveBeenCalledTimes(1);

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(newVerificationAction.newVerification).toHaveBeenCalledTimes(1);
	});

	it("shows loading spinner before verification response", () => {
		let resolvePromise: (value: unknown) => void;
		const mockVerificationPromise = new Promise((resolve) => {
			resolvePromise = resolve;
		});
		(newVerificationAction.newVerification as jest.Mock).mockReturnValue(mockVerificationPromise);

		render(<NewVerificationPageView />);

		const loadingSpinnerContainer = screen.getByTestId("loading-spinner");
		expect(loadingSpinnerContainer).toBeInTheDocument();

		resolvePromise!({ success: mockSuccess });
	});
});
