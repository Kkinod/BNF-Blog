import Link from "next/link";
import { UserRole } from "@prisma/client";
import { signOut } from "../../../../auth";
import { ResponsiveMenu } from "./components/ResponsiveMenu";
import { labels } from "@/views/labels";
import { currentUser } from "@/lib/currentUser";
import { routes } from "@/utils/routes";
import "./authLinks.css";

export const AuthLinks = async () => {
	const session = await currentUser();

	const authContent = (
		<>
			<Link href={routes.home} className="link">
				{labels.links.homepage}
			</Link>
			{!session ? (
				<Link href={routes.login} className="link">
					{labels.login}
				</Link>
			) : (
				<>
					{session?.role === UserRole.ADMIN && (
						<>
							<Link href={routes.write} className="link">
								{labels.write}
							</Link>
							<Link href={routes.settings} className="link">
								{labels.settings}
							</Link>
						</>
					)}
					<form
						action={async () => {
							"use server";
							await signOut();
						}}
					>
						<button type="submit" className="link">
							{labels.logout}
						</button>
					</form>
				</>
			)}
		</>
	);

	return (
		<>
			{authContent}
			<ResponsiveMenu>{authContent}</ResponsiveMenu>
		</>
	);
};
