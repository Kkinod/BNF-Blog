"use client";

import { useState } from "react";
import Link from "next/link";
import "./authLinks.css";

export const AuthLinks = () => {
	const [open, setOpen] = useState<boolean>(false);

	const status = "authenticated";

	return (
		<>
			{status === "notauthenticated" ? (
				<Link href="/login" className="link">
					Login
				</Link>
			) : (
				<>
					<Link href="/write" className="link">
						Write
					</Link>
					<span className="authLinks">Logout</span>
				</>
			)}
			<div className="burger" onClick={() => setOpen(!open)}>
				<div className="line"></div>
				<div className="line"></div>
				<div className="line"></div>
			</div>
			{open && (
				<div className="responsiveMenu">
					<Link href="/">Homepage</Link>
					<Link href="/">About</Link>
					<Link href="/">Contact</Link>
					{status === "notAuthenticated" ? (
						<Link href="/login">Login</Link>
					) : (
						<>
							<Link href="/write">Write</Link>
							<span className="authLinks">Logout</span>
						</>
					)}
				</div>
			)}
		</>
	);
};
