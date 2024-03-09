"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./loginPage.css";

const LoginPage = () => {
	const { status } = useSession();

	const router = useRouter();

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/");
		}
	}, [status, router]);

	if (status === "loading") {
		return <div className="loading">Loading...</div>;
	}

	return (
		<div className="loginPage__container">
			<div className="loginPage__wrapper">
				{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
				<div className="loginPage__socialButton" onClick={() => signIn("google")}>
					Sign in with Google
				</div>
				<div className="loginPage__socialButton">Sign in with Github</div>
				<div className="loginPage__socialButton">Sign in with Facebook</div>
			</div>
		</div>
	);
};

export default LoginPage;
