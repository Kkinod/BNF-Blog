import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "./footer.css";
import { getDataCategoriesServer } from "@/features/blog/api/categories/request";
import { getSharedViewData } from "@/hooks/useNavigationData";
import { AuthenticationLinks } from "@/shared/components/molecules/AuthenticationLinks/AuthenticationLinks";
import { i18nConfig } from "@/i18n/settings";
import { labels } from "@/shared/utils/labels";

interface FooterProps {
	locale?: string;
}

export const Footer = async ({ locale = i18nConfig.defaultLocale }: FooterProps) => {
	const currentYear = new Date().getFullYear();
	const categories = await getDataCategoriesServer();
	const { t, localizedRoutes, session } = await getSharedViewData(locale);

	return (
		<div className="footer">
			<div className="footer__top">
				<div className="footer__info">
					<div className="footer__logoContainer">
						<Image
							src="/logo_for_site_150x150.png"
							alt="logo"
							width={50}
							height={50}
							className="rounded-full"
						/>
						<h1 className="logo__text">
							{t("footer.logoText", {
								defaultValue: labels.footer.logoText,
							})}
						</h1>
					</div>
					<p className="footer_description">
						{t("footer.description", {
							defaultValue: labels.footer.description,
						})}
					</p>
					<div className="footer__socialIcons">
						<Link
							href="https://www.linkedin.com/in/kamil-pawelek/"
							target="_blank"
							aria-label="Linkedin"
							className="socialIcon"
						>
							<FaLinkedin />
						</Link>
						<Link
							href="https://github.com/Kkinod/"
							target="_blank"
							aria-label="GitHub"
							className="socialIcon"
						>
							<FaGithub />
						</Link>
					</div>
				</div>

				<div className="footer__linksContainer">
					<div className="links__list">
						<span className="links__listTitle">
							{t("footer.navigation", { defaultValue: labels.footer.navigation })}
						</span>
						<Link href={localizedRoutes.home}>
							{t("footer.homepage", { defaultValue: labels.footer.homepage })}
						</Link>

						<AuthenticationLinks
							t={t}
							localizedRoutes={localizedRoutes}
							session={session}
							buttonClassName="footer-button"
						/>
					</div>

					<div className="links__list">
						<span className="links__listTitle">
							{t("footer.categories", { defaultValue: labels.footer.categories })}
						</span>
						{categories?.map((category) => (
							<Link
								key={category.id}
								href={localizedRoutes.category(category.slug)}
								className={`category-link ${category.slug}`}
							>
								{t(`categories.${category.slug}`, { defaultValue: category.title })}
							</Link>
						))}
					</div>
				</div>
			</div>

			<div className="footer__bottom">
				<p className="footer__copyright">
					© {currentYear}{" "}
					{t("footer.copyright", {
						defaultValue: labels.footer.copyright,
					})}
				</p>
			</div>
		</div>
	);
};
