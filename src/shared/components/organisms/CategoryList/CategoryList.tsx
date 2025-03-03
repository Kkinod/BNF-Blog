import Link from "next/link";
import Image from "next/image";
import { getDataCategoriesServer } from "@/features/blog/api/categories/request";
import { labels } from "@/shared/utils/labels";
import { routes } from "@/shared/utils/routes";
import "./categoryList.css";

export const CategoryList = async () => {
	const data = await getDataCategoriesServer();

	return (
		<div className="categoryList">
			<h1 className="categoryList__title">{labels.popularCategories}</h1>
			<div className="categoryList__categoriesContainer">
				{data?.map((item) => (
					<Link
						href={routes.category(item.slug)}
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
