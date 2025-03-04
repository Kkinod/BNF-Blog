import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UserRole } from "@prisma/client";
import { labels } from "../../../../shared/utils/labels";
import { UserInfo } from "./UserInfo";

jest.mock("@/shared/components/ui/badge", () => ({
	Badge: ({ children, variant }: { children: React.ReactNode; variant: string }) => (
		<div data-testid="badge" data-variant={variant}>
			{children}
		</div>
	),
}));

describe("UserInfo Component", () => {
	const mockUser = {
		id: "user-123",
		name: "John Doe",
		email: "john.doe@example.com",
		role: UserRole.ADMIN,
		isTwoFactorEnabled: true,
		isOAuth: false,
		image: null,
		emailVerified: new Date(),
	};

	afterEach(cleanup);

	it("renders the component with correct label", () => {
		render(<UserInfo label="User Information" user={mockUser} />);

		expect(screen.getByText("User Information")).toBeInTheDocument();
	});

	it("displays all user information correctly", () => {
		render(<UserInfo label="User Information" user={mockUser} />);

		expect(screen.getByText(labels.id)).toBeInTheDocument();
		expect(screen.getByText(labels.name)).toBeInTheDocument();
		expect(screen.getByText(labels.email)).toBeInTheDocument();
		expect(screen.getByText(labels.role)).toBeInTheDocument();
		expect(screen.getByText(labels.twoFactorAuthentication)).toBeInTheDocument();

		expect(screen.getByText("user-123")).toBeInTheDocument();
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
		expect(screen.getByText(UserRole.ADMIN)).toBeInTheDocument();
		expect(screen.getByText("ON")).toBeInTheDocument();
	});

	it("handles undefined user data gracefully", () => {
		render(<UserInfo label="User Information" />);

		expect(screen.getByText(labels.id)).toBeInTheDocument();
		expect(screen.getByText(labels.name)).toBeInTheDocument();
		expect(screen.getByText(labels.email)).toBeInTheDocument();
		expect(screen.getByText(labels.role)).toBeInTheDocument();
		expect(screen.getByText(labels.twoFactorAuthentication)).toBeInTheDocument();

		expect(screen.queryByText("user-123")).not.toBeInTheDocument();
		expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
		expect(screen.queryByText("john.doe@example.com")).not.toBeInTheDocument();
		expect(screen.queryByText(UserRole.ADMIN)).not.toBeInTheDocument();

		expect(screen.getByText("OFF")).toBeInTheDocument();
	});

	it("displays OFF for two factor authentication when disabled", () => {
		const userWithoutTwoFactor = {
			...mockUser,
			isTwoFactorEnabled: false,
		};

		render(<UserInfo label="User Information" user={userWithoutTwoFactor} />);

		expect(screen.getByText("OFF")).toBeInTheDocument();
	});

	it("applies correct badge variant for enabled two factor authentication", () => {
		render(<UserInfo label="User Information" user={mockUser} />);

		const badge = screen.getByTestId("badge");
		expect(badge).toHaveAttribute("data-variant", "success");
		expect(badge).toHaveTextContent("ON");
	});

	it("applies correct badge variant for disabled two factor authentication", () => {
		const userWithoutTwoFactor = {
			...mockUser,
			isTwoFactorEnabled: false,
		};

		render(<UserInfo label="User Information" user={userWithoutTwoFactor} />);

		const badge = screen.getByTestId("badge");
		expect(badge).toHaveAttribute("data-variant", "destructive");
		expect(badge).toHaveTextContent("OFF");
	});
});
