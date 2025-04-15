import Link from "next/link";
import { ResponsiveMenu } from "./components/ResponsiveMenu";
import { getSharedViewData } from "@/hooks/useNavigationData";
import { AuthenticationLinks } from "@/shared/components/molecules/AuthenticationLinks/AuthenticationLinks";
import { labels } from "@/shared/utils/labels";
import { getServerRegistrationStatus } from "@/hooks/useServerRegistration";
import "./authLinks.css";

interface AuthLinksProps {
	locale?: string;
}

export const AuthLinks = async ({ locale = "pl" }: AuthLinksProps) => {
	const { t, localizedRoutes, session } = await getSharedViewData(locale);
	const { isRegistrationEnabled } = await getServerRegistrationStatus();

	const authContent = (
		<>
			<Link href={localizedRoutes.home} className="link">
				{t("links.homepage", { defaultValue: labels.links.homepage })}
			</Link>
			<AuthenticationLinks
				t={t}
				localizedRoutes={localizedRoutes}
				session={session}
				buttonClassName="link"
				isRegistration={isRegistrationEnabled}
			/>
		</>
	);

	return (
		<>
			{authContent}
			<ResponsiveMenu>{authContent}</ResponsiveMenu>
		</>
	);
};
