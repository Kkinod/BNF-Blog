import Image from "next/image";
import Link from "next/link";
import "./footer.css";

export const Footer = () => {
	return (
		<div className="footer">
			<div className="footer__info">
				<div className="footer__logoContainer">
					<Image src="/logo.png" alt="logo" width={50} height={50} />
					<h1 className="logo__text">kkinod</h1>
				</div>
				<p className="footer_description">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat illo vel impedit quam
					libero alias facere sequi quia accusantium, minima voluptate natus nam ex eaque ut
					nesciunt assumenda, nobis modi?
				</p>
				<div className="footer__icons">
					<Image src="/facebook.png" alt="facebook logo" width={18} height={18} />
					<Image src="/instagram.png" alt="instagram logo" width={18} height={18} />
					<Image src="/tiktok.png" alt="tiktok logo" width={18} height={18} />
					<Image src="/youtube.png" alt="youtube logo" width={18} height={18} />
				</div>
			</div>
			<div className="footer__linksContainer">
				<div className="links__list">
					<span className="links__listTitle">Links</span>
					<Link href="/">Homepage</Link>
					<Link href="/">Blog</Link>
					<Link href="/">About</Link>
					<Link href="/">Contact</Link>
				</div>
				<div className="links__list">
					<span className="links__listTitle">Tags</span>
					<Link href="/">Style</Link>
					<Link href="/">Fashin</Link>
					<Link href="/">Coding</Link>
					<Link href="/">Travel</Link>
				</div>
				<div className="links__list">
					<span className="links__listTitle">Social</span>
					<Link href="/">Facebook</Link>
					<Link href="/">Instagram</Link>
					<Link href="/">Tiktok</Link>
					<Link href="/">Youtube</Link>
				</div>
			</div>
		</div>
	);
};
