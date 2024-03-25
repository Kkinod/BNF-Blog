import Image from "next/image";
import Link from "next/link";
import { AuthLinks } from "../AuthLinks/AuthLinks";
import { ThemeToggle } from "../../molecules/ThemeToggle/ThemeToggle";
import "./navbar.css";

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
				<Link href="/" className="link">
					Homepage
				</Link>
				<Link href="/" className="link">
					Contact
				</Link>
				<Link href="/" className="link">
					About
				</Link>
				<AuthLinks />
			</div>
		</div>
	);
};
