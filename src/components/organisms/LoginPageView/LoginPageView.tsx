"use client";
import {
	// signIn,
	useSession,
} from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { LoginButton } from "@/components/atoms/LoginButton/LoginButton";
import { LoginCardWrapper } from "@/components/atoms/LoginCardWrapper/LoginCardWrapper";
import "./loginPageView.css";

export const LoginPageView = () => {
	// const { status } = useSession();

	// const router = useRouter();

	// useEffect(() => {
	// 	if (status === "authenticated") {
	// 		router.push("/");
	// 	}
	// }, [status, router]);

	// if (status === "loading") {
	// 	return <div className="loading">Loading...</div>;
	// }

	return (
		<div className="loginPage__container">
			<LoginCardWrapper
				headerLabel={"Welcome Back"}
				backButtonLabel={"Don't have an account?"}
				backButtonHref={"/auth/register"}
				showSocial
			>
				{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
				{/* <div className="loginPage__socialButton" onClick={() => signIn("google")}>
					Sign in with Google
				</div>
				<div className="loginPage__socialButton">Sign in with Github</div>
				<div className="loginPage__socialButton">Sign in with Facebook</div> */}
				<LoginButton>
					<Button size="lg">Sign in</Button>
				</LoginButton>
			</LoginCardWrapper>
		</div>
	);
};
