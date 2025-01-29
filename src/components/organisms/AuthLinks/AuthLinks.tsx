import Link from "next/link";
import { UserRole } from "@prisma/client";
import { signOut } from "../../../../auth";
import { labels } from "@/views/labels";
import { currentUser } from "@/lib/currentUser";
import "./authLinks.css";

export const AuthLinks = async () => {
	const session = await currentUser();

	return (
		<>
			{!session ? (
				<Link href="/login" className="link">
					{labels.login}
				</Link>
			) : (
				<>
					{session?.role === UserRole.ADMIN && (
						<>
							<Link href="/write" className="link">
								{labels.write}
							</Link>
							<Link href="/settings" className="link">
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
						<button type="submit">{labels.logout}</button>
					</form>
				</>
			)}
		</>
	);
};
