import Link from "next/link";
import { UserRole } from "@prisma/client";
import type { TFunction } from "i18next";
import { signOut } from "../../../../../auth";
import { type LocalizedRoutes } from "@/shared/utils/routes";
import { labels } from "@/shared/utils/labels";

interface AuthenticationLinksProps {
	t: TFunction<string, undefined>;
	localizedRoutes: LocalizedRoutes;
	session: { role?: UserRole } | null | undefined;
	buttonClassName?: string;
	linkClassName?: string;
}

export const AuthenticationLinks = ({
	t,
	localizedRoutes,
	session,
	buttonClassName = "link",
	linkClassName = "link",
}: AuthenticationLinksProps) => {
	if (!session) {
		return (
			<Link href={localizedRoutes.login} className={linkClassName}>
				{t("authLinks.login", { defaultValue: labels.authLinks.login })}
			</Link>
		);
	}

	return (
		<>
			{(session.role === UserRole.ADMIN || session.role === UserRole.SUPERADMIN) && (
				<Link href={localizedRoutes.write} className={linkClassName}>
					{t("authLinks.write", { defaultValue: labels.authLinks.write })}
				</Link>
			)}
			<Link href={localizedRoutes.settings} className={linkClassName}>
				{t("authLinks.settings", { defaultValue: labels.authLinks.settings })}
			</Link>
			<form
				action={async () => {
					"use server";
					await signOut();
				}}
			>
				<button type="submit" className={buttonClassName}>
					{t("authLinks.logout", { defaultValue: labels.authLinks.logout })}
				</button>
			</form>
		</>
	);
};
