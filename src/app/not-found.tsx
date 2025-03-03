import Link from "next/link";
import { labels } from "@/shared/utils/labels";
import { routes } from "@/shared/utils/routes";

export default function NotFound() {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-4">
			<h2 className="text-4xl font-bold">{labels.errors.pageNotFound}</h2>
			<Link
				href={routes.home}
				className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
			>
				{labels.backToHome}
			</Link>
		</div>
	);
}
