"use client";

import { useState } from "react";
import { labels } from "@/views/labels";

export const ResponsiveMenu = ({ children }: { children: React.ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleClick = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		const clickedLink = target.closest("a, button");

		// Do not close the menu if the logout button is clicked
		if (!clickedLink) return;
		if (clickedLink.textContent === labels.logout) return;

		setIsOpen(false);
	};

	return (
		<>
			<div className="burger" onClick={() => setIsOpen(!isOpen)}>
				<div className="line" />
				<div className="line" />
				<div className="line" />
			</div>
			<div className={`responsiveMenu ${isOpen ? "open" : ""}`} onClick={handleClick}>
				{children}
			</div>
		</>
	);
};
