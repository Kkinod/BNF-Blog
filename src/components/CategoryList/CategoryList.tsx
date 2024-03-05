import Link from "next/link";
import Image from "next/image";
import "./categoryList.css";

export const CategoryList = () => {
	return (
		<div className="categoryList">
			<h1 className="categoryList__title">Popular Categories</h1>
			<div className="categoryList__categoriesContainer">
				<Link href="/blog?cat=style" className="category category--style">
					<Image src="/style.png" alt="" width={32} height={32} className="category__image" />
					style
				</Link>
				<Link href="/blog?cat=style" className="category category--style">
					<Image src="/style.png" alt="" width={32} height={32} className="category__image" />
					style
				</Link>
				<Link href="/blog?cat=style" className="category category--style">
					<Image src="/style.png" alt="" width={32} height={32} className="category__image" />
					style
				</Link>
				<Link href="/blog?cat=style" className="category category--style">
					<Image src="/style.png" alt="" width={32} height={32} className="category__image" />
					style
				</Link>
				<Link href="/blog?cat=style" className="category category--style">
					<Image src="/style.png" alt="" width={32} height={32} className="category__image" />
					style
				</Link>
				<Link href="/blog?cat=style" className="category category--style">
					<Image src="/style.png" alt="" width={32} height={32} className="category__image" />
					style
				</Link>
			</div>
		</div>
	);
};
