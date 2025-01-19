"use client";

import { useRouter, useSearchParams } from "next/navigation";
import "./pagination.css";
import { labels } from "@/views/labels";

interface Pagination {
	page: number;
	hasPrev: boolean;
	hasNext: boolean;
	maxPage: number;
}

export const Pagination = ({ page, hasPrev, hasNext, maxPage }: Pagination) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const cat = searchParams.get("cat");

	return (
		<div className="pagination">
			<button
				className="pagination__button"
				disabled={!hasPrev}
				onClick={() => router.push(`?page=${page - 1}${cat ? `&cat=${cat}` : ""}`)}
			>
				{labels.previous}
			</button>
			<div className="flex items-center">{`${page}/${maxPage}`}</div>
			<button
				className="pagination__button"
				disabled={!hasNext}
				onClick={() => router.push(`?page=${page + 1}${cat ? `&cat=${cat}` : ""}`)}
			>
				{labels.next}
			</button>
		</div>
	);
};
