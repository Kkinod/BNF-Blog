"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Button } from "@/shared/components/ui/button";
import { UserButton } from "@/shared/components/molecules/UserButton/UserButton";
import { labels } from "@/shared/utils/labels";
import { routes } from "@/shared/utils/routes";

export const SettingsNavbar = () => {
	const pathname = usePathname();
	const { data: session } = useSession();

	const isAdmin = session?.user?.role === UserRole.ADMIN;

	return (
		<nav className="mt-5 flex w-full max-w-[600px] items-center justify-between rounded-xl bg-secondary p-4 shadow-sm">
			<div className="flex gap-x-2">
				<Button asChild variant={pathname === "/profil" ? "default" : "outline"}>
					<Link href={routes.profil}>{labels.profil}</Link>
				</Button>
				{isAdmin && (
					<Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
						<Link href={routes.admin}>{labels.admin}</Link>
					</Button>
				)}
				<Button asChild variant={pathname === "/settings" ? "default" : "outline"}>
					<Link href={routes.settings}>{labels.settings}</Link>
				</Button>
			</div>
			<div className="block xs:hidden">
				<UserButton />
			</div>
		</nav>
	);
};
