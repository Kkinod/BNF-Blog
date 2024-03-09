"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import "./authLinks.css";

export const AuthLinks = () => {
	const [open, setOpen] = useState<boolean>(false);

	const { status } = useSession();

	return (
		<>
			{status === "unauthenticated" ? (
				<Link href="/login" className="link">
					Login
				</Link>
			) : (
				<>
					<Link href="/write" className="link">
						Write
					</Link>
					{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
					<span className="authLinks" onClick={() => signOut()}>
						Logout
					</span>
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
					{status === "unauthenticated" ? (
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
