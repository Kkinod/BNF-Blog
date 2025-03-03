"use client";

import { logout } from "../../../../../actions/logout";

interface LogoutButtonProps {
	children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
	const onClick = () => {
		logout()
			.then(() => {
				// some action after logout, for e.g. redirection
			})
			.catch((error) => {
				console.error("Error logging out:", error);
			});
	};

	return (
		<span onClick={onClick} className="cursor-pointer">
			{children}
		</span>
	);
};
