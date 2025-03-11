"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { labels } from "@/shared/utils/labels";
import { routes } from "@/shared/utils/routes";

export default function Error({
	_error,
	reset,
}: {
	_error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();

	return (
		<div className="flex h-full flex-col items-center justify-center gap-4">
			<h2 className="text-4xl font-bold">{labels.errors.somethingWentWrong}</h2>
			<div className="flex gap-4">
				<Button variant="outline" onClick={() => reset()} className="text-sm">
					{labels.tryAgain}
				</Button>
				<Button
					variant="link"
					onClick={() => router.replace(routes.home)}
					className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
				>
					{labels.backToHome}
				</Button>
			</div>
		</div>
	);
}
