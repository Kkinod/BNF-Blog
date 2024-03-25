import Link from "next/link";
import { getDataCategories } from "@/utils/services/categories/request";
import "./menuCategories.css";

export const MenuCategories = async () => {
	const data = await getDataCategories();

	return (
		<div className="menu__categoryList">
			{data.map((item) => (
				<Link
					key={item.id}
					href={`/blog?cat=${item.slug}`}
					className={`category__item category__${item.slug}`}
				>
					{item.title}
				</Link>
			))}
		</div>
	);
};
