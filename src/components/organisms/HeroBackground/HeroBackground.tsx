"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { MatrixBackground } from "../MatrixBackground/MatrixBackground";
import categoryNotFoundBgImage from "./../../../../public/categoryNotFound.png";
import backendBgImage from "./../../../../public/backend.png";
import booksBgImage from "./../../../../public/books.png";
import codingBgImage from "./../../../../public/coding.png";
import frontnedBgImage from "./../../../../public/frontend.png";
import securityBgImage from "./../../../../public/security.png";
import travelBgImage from "./../../../../public/travel.png";
import "./heroBackground.css";

const categoryBackgrounds = {
	backend: backendBgImage.src,
	books: booksBgImage.src,
	coding: codingBgImage.src,
	frontend: frontnedBgImage.src,
	security: securityBgImage.src,
	travel: travelBgImage.src,
};

export const HeroBackground = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isPostPage = pathname.startsWith("/posts/") || pathname.startsWith("/category");
	const category = searchParams.get("cat");

	const getBackgroundImage = () => {
		if (!category) return categoryNotFoundBgImage.src;
		return (
			categoryBackgrounds[category as keyof typeof categoryBackgrounds] ||
			categoryNotFoundBgImage.src
		);
	};

	return (
		<>
			<div className="hero__background">
				{!isPostPage ? (
					<>
						<div className="hero__shadow" />
						<MatrixBackground />
					</>
				) : (
					<>
						<div className="hero__shadow--image" />
						<div
							className="hero__image"
							style={{ backgroundImage: `url(${getBackgroundImage()})` }}
						/>
					</>
				)}
			</div>
		</>
	);
};
