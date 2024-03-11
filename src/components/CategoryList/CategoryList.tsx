import Link from "next/link";
import Image from "next/image";
import "./categoryList.css";
import { type Category } from "@/app/api/categories/route";

const getData = async (): Promise<Category[]> => {
	const res = await fetch("http://localhost:3000/api/categories", {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Failed");
	}

	const data = (await res.json()) as Category[];
	return data;
};

export const CategoryList = async () => {
	const data = await getData();

	return (
		<div className="categoryList">
			<h1 className="categoryList__title">Popular Categories</h1>
			<div className="categoryList__categoriesContainer">
				{data?.map((item) => (
					<Link
						href={`/blog?cat=${item.slug}`}
						className={`category category--${item.slug}`}
						key={item._id}
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
