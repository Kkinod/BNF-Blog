import Image from "next/image";
import "./navbar.css";
import Link from "next/link";
import { AuthLinks } from "../AuthLinks/AuthLinks";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

export const Navbar = () => {
	return (
		<div className="navbar">
			<div className="social">
				<Image src="/facebook.png" alt="facebookIcon" width={24} height={24} />
				<Image src="/instagram.png" alt="instagramIcon" width={24} height={24} />
				<Image src="/tiktok.png" alt="tiktokIcon" width={24} height={24} />
				<Image src="/youtube.png" alt="youtubeIcon" width={24} height={24} />
			</div>
			<div className="logo">bezpiecznik na fron(t)cie</div>
			<div className="links">
				<ThemeToggle />
				<Link href="/">Homepage</Link>
				<Link href="/">Contact</Link>
				<Link href="/">About</Link>
				<AuthLinks />
			</div>
		</div>
	);
};
