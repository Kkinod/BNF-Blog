"use client";

import { useRouter } from "next/navigation";
import { labels } from "@/shared/utils/labels";
import { routes } from "@/shared/utils/routes";
import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
	const router = useRouter();

	const handleNavigateHome = () => {
		router.replace(routes.home);
	};

	return (
		<div className="flex h-full flex-col items-center justify-center gap-4">
			<h2 className="text-4xl font-bold">{labels.errors.pageNotFound}</h2>
			<Button
				variant="link"
				onClick={handleNavigateHome}
				className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
			>
				{labels.backToHome}
			</Button>
		</div>
	);
}
