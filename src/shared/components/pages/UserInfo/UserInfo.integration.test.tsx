import React from "react";
import { render, screen } from "@testing-library/react";
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

jest.mock("@/shared/components/ui/card", () => ({
	Card: ({ children, className }: { children: React.ReactNode; className: string }) => (
		<div data-testid="card" className={className}>
			{children}
		</div>
	),
	CardHeader: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="card-header">{children}</div>
	),
	CardContent: ({ children, className }: { children: React.ReactNode; className: string }) => (
		<div data-testid="card-content" className={className}>
			{children}
		</div>
	),
}));

describe("UserInfo Integration", () => {
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

	it("renders with all UI components correctly", () => {
		render(<UserInfo label="User Information" user={mockUser} />);

		expect(screen.getByTestId("card")).toBeInTheDocument();
		expect(screen.getByTestId("card-header")).toBeInTheDocument();
		expect(screen.getByTestId("card-content")).toBeInTheDocument();

		expect(screen.getByTestId("card")).toHaveClass("w-full max-w-[600px] shadow-md");

		expect(screen.getByTestId("card-content")).toHaveClass("space-y-4");
	});

	it("renders badge with correct variant for enabled two factor authentication", () => {
		render(<UserInfo label="User Information" user={mockUser} />);

		const badge = screen.getByTestId("badge");
		expect(badge).toHaveAttribute("data-variant", "success");
		expect(badge).toHaveTextContent("ON");
	});

	it("renders badge with correct variant for disabled two factor authentication", () => {
		const userWithoutTwoFactor = {
			...mockUser,
			isTwoFactorEnabled: false,
		};

		render(<UserInfo label="User Information" user={userWithoutTwoFactor} />);

		const badge = screen.getByTestId("badge");
		expect(badge).toHaveAttribute("data-variant", "destructive");
		expect(badge).toHaveTextContent("OFF");
	});

	it("displays all user information fields with correct layout", () => {
		render(<UserInfo label="User Information" user={mockUser} />);

		const infoFields = screen.getAllByText(/^(ID|Name|Email|Role|Two Factor Authentication)$/i, {
			exact: false,
		});
		expect(infoFields).toHaveLength(5);

		expect(screen.getByText("user-123")).toBeInTheDocument();
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
		expect(screen.getByText(UserRole.ADMIN)).toBeInTheDocument();
	});

	it("handles undefined user gracefully", () => {
		render(<UserInfo label="User Information" />);

		expect(screen.getByText(labels.id)).toBeInTheDocument();
		expect(screen.getByText(labels.name)).toBeInTheDocument();
		expect(screen.getByText(labels.email)).toBeInTheDocument();
		expect(screen.getByText(labels.role)).toBeInTheDocument();
		expect(screen.getByText(labels.twoFactorAuthentication)).toBeInTheDocument();

		const badge = screen.getByTestId("badge");
		expect(badge).toHaveAttribute("data-variant", "destructive");
		expect(badge).toHaveTextContent("OFF");
	});
});
