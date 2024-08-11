import defaultBackgroundImage from "./../../../../public/bcgMain.jpg";
import "./heroBackground.css";

export const HeroBackground = ({ backgroundImage }: { backgroundImage?: string }) => {
	const imageSrc = backgroundImage || defaultBackgroundImage.src;

	return (
		<div className="hero__background">
			<div className="hero__shadow" />
			<div className="hero__image" style={{ backgroundImage: `url(${imageSrc})` }} />
		</div>
	);
};
