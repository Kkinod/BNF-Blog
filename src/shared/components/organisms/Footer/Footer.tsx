import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { UserRole } from "@prisma/client";
import { signOut } from "../../../../../auth";
import "./footer.css";
import { labels } from "@/shared/utils/labels";
import { getDataCategoriesServer } from "@/features/blog/api/categories/request";
import { routes } from "@/shared/utils/routes";
import { currentUser } from "@/features/auth/utils/currentUser";

export const Footer = async () => {
	const currentYear = new Date().getFullYear();
	const categories = await getDataCategoriesServer();
	const session = await currentUser();

	return (
		<div className="footer">
			<div className="footer__top">
				<div className="footer__info">
					<div className="footer__logoContainer">
						<Image src="/logo.png" alt="logo" width={50} height={50} />
						<h1 className="logo__text">kkinod</h1>
					</div>
					<p className="footer_description">{labels.footer.description}</p>
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
						<span className="links__listTitle">{labels.footer.navigation}</span>
						<Link href="/">{labels.links.homepage}</Link>

						{!session ? (
							<Link href={routes.login}>{labels.login}</Link>
						) : (
							<>
								{(session?.role === UserRole.ADMIN || session?.role === UserRole.SUPERADMIN) && (
									<Link href={routes.write}>{labels.write}</Link>
								)}
								<Link href={routes.settings}>{labels.settings}</Link>
								<form
									action={async () => {
										"use server";
										await signOut();
									}}
								>
									<button type="submit" className="footer-button">
										{labels.logout}
									</button>
								</form>
							</>
						)}
					</div>

					<div className="links__list">
						<span className="links__listTitle">{labels.footer.categories}</span>
						{categories?.map((category) => (
							<Link
								key={category.id}
								href={routes.category(category.slug)}
								className={`category-link ${category.slug}`}
							>
								{category.title}
							</Link>
						))}
					</div>
				</div>
			</div>

			<div className="footer__bottom">
				<p className="footer__copyright">
					© {currentYear} {labels.footer.copyright}
				</p>
			</div>
		</div>
	);
};
