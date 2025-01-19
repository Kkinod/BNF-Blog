"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../molecules/ThemeToggle/ThemeToggle";
import { labels } from "@/views/labels";
import "./navbar.css";

export const Navbar = ({ children }: { children: React.ReactNode }) => {
	const [scrolled, setScrolled] = useState<boolean>(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 0);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className={`navbar ${scrolled && "scrolled"}`}>
			<div className="social">
				<Image src="/facebook.png" alt="facebookIcon" width={24} height={24} />
				<Image src="/instagram.png" alt="instagramIcon" width={24} height={24} />
				<Image src="/tiktok.png" alt="tiktokIcon" width={24} height={24} />
				<Image src="/youtube.png" alt="youtubeIcon" width={24} height={24} />
			</div>
			<div className="logo">
				<span className="full-title">{labels.fullBlogTitle}</span>
				<Link href="/" className="short-title">
					{labels.shortBlogTitle}
				</Link>
			</div>
			<div className="links">
				<ThemeToggle />
				<Link href="/" className="link">
					{labels.links.homepage}
				</Link>
				<Link href="/" className="link">
					{labels.links.about}
				</Link>
				<Link href="/" className="link">
					{labels.links.contact}
				</Link>
				{children}
			</div>
		</div>
	);
};
