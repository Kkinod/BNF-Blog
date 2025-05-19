"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import defaultImgPost from "../../../../../public/defaultImgPost.webp";

import { AnimatedText } from "@/shared/components/atoms/AnimatedText/AnimatedText";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { formatDate } from "@/shared/utils/formatters";
import { searchPosts } from "@/features/blog/api/posts/request";
import { type ListPost } from "@/app/api/posts/route";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedRoutes } from "@/shared/utils/routes";
import { i18nConfig } from "@/i18n/settings";

import "./searchOverlay.css";
import { labels } from "@/shared/utils/labels";

interface SearchOverlayProps {
	isOpen: boolean;
	onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isClosing, setIsClosing] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<ListPost[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSearchedQuery, setLastSearchedQuery] = useState("");
	const { t, locale } = useTranslation();
	const localizedRoutes = getLocalizedRoutes(locale || i18nConfig.defaultLocale);

	const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

	useEffect(() => {
		if (isOpen) {
			setIsClosing(false);
			setSearchQuery("");
			setSearchResults([]);
			setLastSearchedQuery("");
			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = `${scrollbarWidth}px`;
		} else {
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
		}
		return () => {
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
		};
	}, [isOpen]);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				handleClose();
			}
		};

		if (isOpen) {
			window.addEventListener("keydown", handleEscape);
		}

		return () => {
			window.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	useEffect(() => {
		const trimmedQuery = debouncedSearchQuery.trim();
		if (trimmedQuery && trimmedQuery !== lastSearchedQuery) {
			void handleSearch(trimmedQuery);
		} else if (!trimmedQuery) {
			setSearchResults([]);
		}
	}, [debouncedSearchQuery, lastSearchedQuery]);

	const handleSearch = async (query: string) => {
		setIsLoading(true);
		setLastSearchedQuery(query);

		try {
			const result = await searchPosts(query);
			setSearchResults(result.posts);
		} catch (error) {
			console.error("Search error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setIsClosing(true);
		void new Promise<void>((resolve) => {
			setTimeout(() => {
				onClose();
				resolve();
			}, 300);
		});
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	if (!isOpen) return null;

	return createPortal(
		<div className={`search-overlay ${isClosing ? "closing" : ""}`}>
			<div className="search-overlay__content">
				<button className="search-overlay__close" onClick={handleClose}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>

				<div className="search-overlay__input-container">
					<div className="search-overlay__icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
					</div>
					<input
						ref={inputRef}
						type="text"
						className="search-overlay__input"
						placeholder={t("searchOverlay.search", { defaultValue: labels.searchOverlay.search })}
						aria-label={t("searchOverlay.search", { defaultValue: labels.searchOverlay.search })}
						value={searchQuery}
						onChange={handleInputChange}
					/>
				</div>

				<div className="search-results">
					{isLoading ? (
						<div className="search-results__loading">
							<AnimatedText
								text={t("searchOverlay.loading", { defaultValue: labels.searchOverlay.loading })}
								theme="matrix"
								size="medium"
							/>
						</div>
					) : (
						<>
							{searchResults.length > 0 ? (
								<ul className="search-results__list">
									{searchResults.map((post) => (
										<li key={post.id} className="search-results__item">
											<Link
												href={localizedRoutes.post(post.slug, post.catSlug)}
												className="search-results__link"
												onClick={handleClose}
											>
												<div className="search-results__image">
													{post.img ? (
														<Image
															src={post.img}
															alt={post.title}
															width={80}
															height={80}
															className="search-results__thumbnail"
														/>
													) : (
														<div className="search-results__no-image">
															<Image
																src={defaultImgPost}
																alt="Default post image"
																width={80}
																height={80}
																className="search-results__thumbnail"
															/>
														</div>
													)}
												</div>
												<div className="search-results__content">
													<h3 className="search-results__title">{post.title}</h3>
													<div className="search-results__meta">
														<span
															className="search-results__category"
															style={{ color: `var(--category-${post.catSlug})` }}
														>
															{t(`categories.${post.catSlug}`, { defaultValue: post.catSlug })}
														</span>
														<span className="search-results__date">
															{formatDate(post.createdAt)}
														</span>
													</div>
												</div>
											</Link>
										</li>
									))}
								</ul>
							) : (
								searchQuery.trim() && (
									<div className="search-results__empty">
										{t("searchOverlay.searchNoResults", {
											defaultValue: labels.searchOverlay.searchNoResults,
										})}
									</div>
								)
							)}
						</>
					)}
				</div>
			</div>
		</div>,
		document.body,
	);
};
