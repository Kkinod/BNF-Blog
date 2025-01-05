"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/molecules/UserButton/UserButton";
import { labels } from "@/views/labels";

export const SettingsNavbar = () => {
	const pathname = usePathname();

	return (
		<nav className="mt-5 flex w-full max-w-[600px] items-center justify-between rounded-xl bg-secondary p-4 shadow-sm">
			<div className="flex gap-x-2">
				<Button asChild variant={pathname === "/server" ? "default" : "outline"}>
					<Link href="/server">{labels.server}</Link>
				</Button>
				<Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
					<Link href="/admin">{labels.admin}</Link>
				</Button>
				<Button asChild variant={pathname === "/settings" ? "default" : "outline"}>
					<Link href="/settings">{labels.settings}</Link>
				</Button>
			</div>
			<div className="xs:hidden block">
				<UserButton />
			</div>
		</nav>
	);
};
