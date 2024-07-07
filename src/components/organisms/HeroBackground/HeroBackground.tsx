import Image from "next/image";
import HeroBgcImg from "../../../../public/bcgMain.jpg";
import "./heroBackground.css";

export const HeroBackground = () => {
	return (
		<div className="hero__background">
			<div className="hero__shadow" />
			<Image src={HeroBgcImg} alt="hero section photo" fill className="hero__image"/>
		</div>
	);
};
