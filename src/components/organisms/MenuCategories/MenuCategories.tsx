import Link from "next/link";
import { getDataCategoriesServer } from "@/utils/services/categories/request";
import "./menuCategories.css";

export const MenuCategories = async () => {
	const data = await getDataCategoriesServer();

	return (
		<div className="menu__categoryList">
			{data.map((item) => (
				<Link
					key={item.id}
					href={`/blog?cat=${item.slug}`}
					className={`category__item category--${item.slug}`}
				>
					{item.title}
				</Link>
			))}
		</div>
	);
};
