"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { labels } from "@/shared/utils/labels";
import "./searchOverlay.css";

interface SearchOverlayProps {
	isOpen: boolean;
	onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [mounted, setMounted] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	useEffect(() => {
		if (isOpen) {
			setIsClosing(false);
		}
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

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			onClose();
		}, 300);
	};

	if (!isOpen || !mounted) return null;

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
						placeholder={labels.posts.search}
						aria-label={labels.search}
					/>
				</div>
			</div>
		</div>,
		document.body,
	);
};
