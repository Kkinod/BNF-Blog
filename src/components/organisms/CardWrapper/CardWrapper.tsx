"use client";

import { Header } from "../../atoms/Header/Header";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Social } from "@/components/molecules/Social/Social";
import { BackButton } from "@/components/molecules/BackButton/BackButton";
import "./cardWrapper.css";

interface LoginCardWrapperProps {
	children: React.ReactNode;
	headerLabel: string;
	backButtonLabel: string;
	backButtonHref: string;
	showSocial?: boolean;
}

export const CardWrapper = ({
	children,
	headerLabel,
	backButtonLabel,
	backButtonHref,
	showSocial,
}: LoginCardWrapperProps) => {
	return (
		<div className="loginPage__wrapper">
			<CardHeader>
				<Header label={headerLabel} />
			</CardHeader>
			<CardContent>{children}</CardContent>
			{showSocial && (
				<CardFooter>
					<Social />
				</CardFooter>
			)}
			<CardFooter>
				<BackButton label={backButtonLabel} href={backButtonHref} />
			</CardFooter>
		</div>
	);
};
