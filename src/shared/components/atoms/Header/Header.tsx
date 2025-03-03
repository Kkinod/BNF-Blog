import { Poppins } from "next/font/google";
import { cn } from "@/shared/utils/clx";

const font = Poppins({
	subsets: ["latin"],
	weight: ["600"],
});

interface Header {
	label: string;
	title: string;
}

export const Header = ({ label, title }: Header) => {
	return (
		<div className="flex w-full flex-col items-center justify-center gap-y-4">
			<h1 className={cn("text-3xl font-semibold", font.className)}>{title}</h1>
			<p className="text-sm text-muted-foreground">{label}</p>
		</div>
	);
};
