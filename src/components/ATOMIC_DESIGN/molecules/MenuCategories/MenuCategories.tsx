import Link from "next/link";
import "./menuCategories.css";

export const MenuCategories = () => {
	return (
		<div className="menu__categoryList">
			<Link href="/blog?cat=style" className="category__item category__style">
				Style
			</Link>

			<Link href="/blog?cat=style" className="category__item category__fashion">
				Fashion
			</Link>

			<Link href="/blog?cat=style" className="category__item category__food">
				Food
			</Link>

			<Link href="/blog?cat=style" className="category__item category__travel">
				Travel
			</Link>

			<Link href="/blog?cat=style" className="category__item category__culture">
				Culture
			</Link>

			<Link href="/blog?cat=style" className="category__item category__coding">
				Cooding
			</Link>
		</div>
	);
};
