"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, type KeyboardEvent } from "react";
import { labels } from "@/shared/utils/labels";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import "./pagination.css";

interface PaginationProps {
	page: number;
	hasPrev: boolean;
	hasNext: boolean;
	maxPage: number;
}

const a11yLabels = {
	pagination: "Pagination",
	currentPage: "Current page",
	goToPage: "Go to page",
	previousPage: "Previous page",
	nextPage: "Next page",
};

export const Pagination = ({ page, hasPrev, hasNext, maxPage }: PaginationProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const cat = searchParams.get("cat");

	const isMobile = useMediaQuery("(max-width: 26.5rem)");
	const isTablet = useMediaQuery("(max-width: 38rem) and (min-width: 26.5rem)");

	const navigateToPage = useCallback(
		(selectedPage: number) => {
			router.push(`?page=${selectedPage}${cat ? `&cat=${cat}` : ""}`);
		},
		[router, cat],
	);

	// Key support for accessibility
	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLButtonElement>, selectedPage: number) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				navigateToPage(selectedPage);
			}
		},
		[navigateToPage],
	);

	// Function that creates a label for screen readers for each page
	const getPageAriaLabel = useCallback(
		(pageNumber: number) => {
			if (pageNumber === page) {
				return `${a11yLabels.currentPage} ${pageNumber}`;
			}
			return `${a11yLabels.goToPage} ${pageNumber}`;
		},
		[page],
	);

	// Function to generate a list of pages to display using useMemo
	const pageNumbers = useMemo(() => {
		const result = [];
		// We define the number of visible pages depending on the screen size
		let visiblePages = 5; // desktop

		if (isTablet) {
			visiblePages = 1; // tablet (< 38rem)
		} else if (isMobile) {
			visiblePages = 0; // mobile (< 26.5rem) - only the first and last page without middle pages
		}

		// Always add the first page
		result.push(1);

		if (isMobile && maxPage > 1) {
			if (page !== 1 && page !== maxPage) {
				result.push("...");
				result.push(page);
				if (maxPage > page + 1) {
					result.push("...");
				}
			} else if (maxPage > 2) {
				result.push("...");
			}
			result.push(maxPage);
			return result;
		}

		let startPage = Math.max(2, page - Math.floor(visiblePages / 2));
		const endPage = Math.min(maxPage - 1, startPage + visiblePages - 1);

		if (endPage - startPage < visiblePages - 1) {
			startPage = Math.max(2, endPage - visiblePages + 1);
		}

		if (startPage > 2) {
			result.push("...");
		}

		for (let i = startPage; i <= endPage; i++) {
			result.push(i);
		}

		if (endPage < maxPage - 1) {
			result.push("...");
		}

		if (maxPage > 1) {
			result.push(maxPage);
		}

		return result;
	}, [page, maxPage, isMobile, isTablet]);

	return (
		<nav className="pagination" role="navigation" aria-label={a11yLabels.pagination}>
			<button
				className="pagination__button"
				disabled={!hasPrev}
				onClick={() => navigateToPage(page - 1)}
				onKeyDown={(e) => handleKeyDown(e, page - 1)}
				aria-label={a11yLabels.previousPage}
				rel="prev"
			>
				{labels.previous}
			</button>

			<div className="pagination__pages">
				{pageNumbers.map((item, index) =>
					typeof item === "number" ? (
						<button
							key={index}
							className={`pagination__page-number ${page === item ? "pagination__page-number--active" : ""}`}
							onClick={() => navigateToPage(item)}
							onKeyDown={(e) => handleKeyDown(e, item)}
							disabled={page === item}
							aria-label={getPageAriaLabel(item)}
							aria-current={page === item ? "page" : undefined}
						>
							{item}
						</button>
					) : (
						<span key={index} className="pagination__ellipsis" aria-hidden="true">
							{item}
						</span>
					),
				)}
			</div>

			<button
				className="pagination__button"
				disabled={!hasNext}
				onClick={() => navigateToPage(page + 1)}
				onKeyDown={(e) => handleKeyDown(e, page + 1)}
				aria-label={a11yLabels.nextPage}
				rel="next"
			>
				{labels.next}
			</button>
		</nav>
	);
};
