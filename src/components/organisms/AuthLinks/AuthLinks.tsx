import Link from "next/link";
import { UserRole } from "@prisma/client";
import { signOut } from "../../../../auth";
import { labels } from "@/views/labels";
import { currentUser } from "@/lib/currentUser";
import "./authLinks.css";
import { routes } from "@/utils/routes";

export const AuthLinks = async () => {
	const session = await currentUser();

	return (
		<>
			{!session ? (
				<Link href={routes.login} className="link">
					{labels.login}
				</Link>
			) : (
				<>
					{session?.role === UserRole.ADMIN && (
						<Link href={routes.write} className="link">
							{labels.write}
						</Link>
					)}
					<form
						action={async () => {
							"use server";

							await signOut();
						}}
					>
						<button type="submit">{labels.logout}</button>
					</form>
				</>
			)}
		</>
	);
};
