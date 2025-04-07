import Link from "next/link";
import { UserRole } from "@prisma/client";
import { signOut } from "../../../../../auth";
import { type LocalizedRoutes } from "@/shared/utils/routes";

interface AuthenticationLinksProps {
	t: (key: string) => string;
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
				{t("login")}
			</Link>
		);
	}

	return (
		<>
			{(session.role === UserRole.ADMIN || session.role === UserRole.SUPERADMIN) && (
				<Link href={localizedRoutes.write} className={linkClassName}>
					{t("write")}
				</Link>
			)}
			<Link href={localizedRoutes.settings} className={linkClassName}>
				{t("settings")}
			</Link>
			<form
				action={async () => {
					"use server";
					await signOut();
				}}
			>
				<button type="submit" className={buttonClassName}>
					{t("logout")}
				</button>
			</form>
		</>
	);
};
