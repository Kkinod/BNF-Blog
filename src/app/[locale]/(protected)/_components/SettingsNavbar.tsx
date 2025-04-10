"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Button } from "@/shared/components/ui/button";
import { UserButton } from "@/shared/components/molecules/UserButton/UserButton";
import { routes } from "@/shared/utils/routes";
import { useClientTranslation } from "@/i18n/client-hooks";
import { labels } from "@/shared/utils/labels";

export const SettingsNavbar = () => {
	const pathname = usePathname();
	const { data: session } = useSession();
	const { t } = useClientTranslation();

	const isAdmin =
		session?.user?.role === UserRole.ADMIN || session?.user?.role === UserRole.SUPERADMIN;

	return (
		<nav className="mt-5 flex w-full max-w-[600px] items-center justify-between rounded-xl bg-secondary p-4 shadow-sm">
			<div className="flex gap-x-2">
				<Button asChild variant={pathname === "/profil" ? "default" : "outline"}>
					<Link href={routes.profil}>
						{t("settingsNavbar.profile", { defaultValue: labels.settingsNavbar.profile })}
					</Link>
				</Button>
				{isAdmin && (
					<Button asChild variant={pathname === "/admin" ? "default" : "outline"}>
						<Link href={routes.admin}>
							{t("settingsNavbar.admin", { defaultValue: labels.settingsNavbar.admin })}
						</Link>
					</Button>
				)}
				<Button asChild variant={pathname === "/settings" ? "default" : "outline"}>
					<Link href={routes.settings}>
						{t("settingsNavbar.settings", { defaultValue: labels.settingsNavbar.settings })}
					</Link>
				</Button>
			</div>
			<div className="block xs:hidden">
				<UserButton />
			</div>
		</nav>
	);
};
