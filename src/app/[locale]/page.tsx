import { CardList } from "@/shared/components/organisms/CardList/CardList";
import { CategoryList } from "@/shared/components/organisms/CategoryList/CategoryList";
import { Featured } from "@/shared/components/organisms/Featured/Featured";
import { Menu } from "@/shared/components/organisms/Menu/Menu";

interface SearchParams {
	page: string;
}

export default function Home({
	searchParams,
	params,
}: {
	searchParams: SearchParams;
	params: { locale: string };
}) {
	const page = parseInt(searchParams.page) || 1;
	const { locale } = params;

	return (
		<div>
			<Featured locale={locale} />
			<div className="content">
				<CardList page={page} locale={locale} />
				<Menu locale={locale} />
			</div>
			<CategoryList locale={locale} />
		</div>
	);
}
