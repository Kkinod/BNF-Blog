"use client";

import { useState, useEffect } from "react";
import { labels } from "@/shared/utils/labels";

export const ResponsiveMenu = ({ children }: { children: React.ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (isOpen) {
			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = `${scrollbarWidth}px`;
		} else {
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
		}
		return () => {
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
		};
	}, [isOpen]);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

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
			<div
				className={`burger ${isOpen ? "burger--active" : ""}`}
				onClick={toggleMenu}
				aria-label={isOpen ? "Close menu" : "Open menu"}
				role="button"
				tabIndex={0}
			>
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
