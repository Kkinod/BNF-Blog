import { MatrixBackground } from "../MatrixBackground/MatrixBackground";
import defaultBackgroundImage from "./../../../../public/bcgMain.jpg";
import matrixBGImage from "./../../../../public/matrixBGSmall.jpg";
import "./heroBackground.css";

export const HeroBackground = ({ backgroundImage }: { backgroundImage?: string }) => {
	// const imageSrc = backgroundImage || defaultBackgroundImage.src;
	const imageSrc = backgroundImage || matrixBGImage.src;

	return (
		<>
			<div className="hero__background">
				{/* <div className="hero__shadow--image" /> */}
				{/* <div className="hero__image" style={{ backgroundImage: `url(${imageSrc})` }} /> */}
				<div className="hero__shadow" />
				<MatrixBackground />
			</div>
		</>
	);
};
