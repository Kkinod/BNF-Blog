"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import { login } from "../../../../../actions/socialLogin";
import { Button } from "@/shared/components/atoms/Button/Button";
import { labels } from "@/shared/utils/labels";

export const Social = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const onSubmit = async (provider: "google" | "github") => {
		try {
			setIsLoading(true);

			const data = await login(provider);
			if (data?.error) {
				console.error("Failed to sign in:", data.error);
				toast.error(data.error);
			}
		} catch (error) {
			console.error("Failed to process login:", error);
			toast.error(labels.errors.somethingWentWrong);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex w-full items-center gap-x-2">
			<Button size="lg" className="w-full" onClick={() => onSubmit("google")} disabled={isLoading}>
				<FcGoogle className="h-5 w-5" />
			</Button>
			<Button size="lg" className="w-full" onClick={() => onSubmit("github")} disabled={isLoading}>
				<FaGithub className="h-5 w-5" />
			</Button>
		</div>
	);
};
