"use client";

import { Button } from "@/shared/components/ui/button";
import { labels } from "@/shared/utils/labels";

export default function GlobalError({
	_error,
	reset,
}: {
	_error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html>
			<body>
				<div className="flex h-screen flex-col items-center justify-center gap-4">
					<h2 className="text-4xl font-bold">{labels.errors.somethingWentWrong}</h2>
					<div className="flex gap-4">
						<Button variant="outline" onClick={() => reset()} className="text-sm">
							{labels.tryAgain}
						</Button>
						<Button
							variant="link"
							onClick={() => (window.location.href = "/")}
							className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
						>
							{labels.backToHome}
						</Button>
					</div>
				</div>
			</body>
		</html>
	);
}
