"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { MatrixBackground } from "../MatrixBackground/MatrixBackground";
import defaultBackgroundImage from "./../../../../public/bcgMain.jpg";
import securityBgImage from "./../../../../public/p1.jpeg";
import backendBgImage from "./../../../../public/fashion.png";
import codingBgImage from "./../../../../public/food.png";
import "./heroBackground.css";

const categoryBackgrounds = {
	security: securityBgImage.src,
	backend: backendBgImage.src,
	frontend: defaultBackgroundImage.src,
	coding: codingBgImage.src,
};

export const HeroBackground = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const isPostPage = pathname.startsWith("/posts/") || pathname.startsWith("/category");
	const category = searchParams.get("cat");

	const getBackgroundImage = () => {
		if (!category) return defaultBackgroundImage.src;
		return (
			categoryBackgrounds[category as keyof typeof categoryBackgrounds] ||
			defaultBackgroundImage.src
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
