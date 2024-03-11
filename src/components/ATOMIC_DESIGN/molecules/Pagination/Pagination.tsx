"use client";

import { useRouter } from "next/navigation";
import "./pagination.css";

interface Pagination {
	page: number;
	hasPrev: boolean;
	hasNext: boolean;
}

export const Pagination = ({ page, hasPrev, hasNext }: Pagination) => {
	const router = useRouter();

	return (
		<div className="pagination">
			<button
				className="pagination__button"
				disabled={!hasPrev}
				onClick={() => router.push(`?page=${page - 1}`)}
			>
				Previous
			</button>
			<button
				className="pagination__button"
				disabled={!hasNext}
				onClick={() => router.push(`?page=${page + 1}`)}
			>
				Next
			</button>
		</div>
	);
};
