import Link from "next/link";
import "./authLinks.css";

export const AuthLinks = () => {
	const status = "notAuthenticated";

	return (
		<>
			{status === "notAuthenticated" ? (
				<Link href="/login">Login</Link>
			) : (
				<>
					<Link href="/write">Write</Link>
					<span className="authLinks">Logout</span>
				</>
			)}
		</>
	);
};
