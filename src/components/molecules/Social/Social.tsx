"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { login } from "../../../../actions/socialLogin";
import { Button } from "@/components/atoms/Button/Button";

export const Social = () => {
	const onSubmit = async (provider: "google" | "github") => {
		try {
			const data = await login(provider);
			if (data?.error) {
				console.error("Failed to sign in:", data.error);
			}
		} catch (error) {
			console.error("Failed to process login:", error);
		}
	};

	return (
		<div className="flex w-full items-center gap-x-2">
			<Button size="lg" className="w-full" onClick={() => onSubmit("google")}>
				<FcGoogle className="h-5 w-5" />
			</Button>
			<Button size="lg" className="w-full" onClick={() => onSubmit("github")}>
				<FaGithub className="h-5 w-5" />
			</Button>
		</div>
	);
};
