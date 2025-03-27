"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchOverlay } from "./SearchOverlay";
import { labels } from "@/shared/utils/labels";
import { routes } from "@/shared/utils/routes";
import "./navbar.css";

export const Navbar = ({ children }: { children: React.ReactNode }) => {
	const [scrolled, setScrolled] = useState<boolean>(false);
	const [searchOpen, setSearchOpen] = useState<boolean>(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 0);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className={`navbar ${scrolled && "scrolled"}`}>
			<div className="search-button" onClick={() => setSearchOpen(true)}>
				<div className="search-icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="search-svg"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
				</div>
				<span>{labels.search}</span>
			</div>
			<div className="logo">
				<span className="full-title">{labels.fullBlogTitle}</span>
				<Link href={routes.home} replace className="short-title">
					{labels.shortBlogTitle}
				</Link>
			</div>
			<div className="links">{children}</div>

			<SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
		</div>
	);
};
