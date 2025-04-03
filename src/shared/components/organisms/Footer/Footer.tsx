import Image from "next/image";
import Link from "next/link";
import {
	FaFacebook,
	FaInstagram,
	FaTwitter,
	FaGithub,
	FaYoutube,
	FaLinkedinIn,
	FaLinkedin,
} from "react-icons/fa";
import "./footer.css";
import { labels } from "@/shared/utils/labels";
import { getDataCategoriesServer } from "@/features/blog/api/categories/request";
import { routes } from "@/shared/utils/routes";

export const Footer = async () => {
	const currentYear = new Date().getFullYear();
	const categories = await getDataCategoriesServer();

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
						<Link href="/about">{labels.links.about}</Link>
						<Link href="/contact">{labels.links.contact}</Link>
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
