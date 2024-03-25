import Link from "next/link";
import Image from "next/image";
import { getDataCategories } from "@/utils/services/categories/request";
import "./categoryList.css";

export const CategoryList = async () => {
	const data = await getDataCategories();

	return (
		<div className="categoryList">
			<h1 className="categoryList__title">Popular Categories</h1>
			<div className="categoryList__categoriesContainer">
				{data?.map((item) => (
					<Link
						href={`/blog?cat=${item.slug}`}
						className={`category category--${item.slug}`}
						key={item.id}
					>
						{item.img && (
							<Image src={item.img} alt="" width={32} height={32} className={`category__image`} />
						)}
						{item.title}
					</Link>
				))}
			</div>
		</div>
	);
};
