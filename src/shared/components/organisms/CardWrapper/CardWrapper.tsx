"use client";

import { Header } from "../../atoms/Header/Header";
import { CardContent, CardFooter, CardHeader } from "@/shared/components/ui/card";
import { Social } from "@/shared/components/molecules/Social/Social";
import { BackButton } from "@/shared/components/molecules/BackButton/BackButton";
import "./cardWrapper.css";

interface LoginCardWrapperProps {
	children: React.ReactNode;
	headerLabel: string;
	backButtonLabel: string;
	backButtonHref: string;
	showSocial?: boolean;
	headerTitle: string;
}

export const CardWrapper = ({
	children,
	headerLabel,
	backButtonLabel,
	backButtonHref,
	showSocial,
	headerTitle,
}: LoginCardWrapperProps) => {
	return (
		<div className="loginPage__wrapper">
			<CardHeader>
				<Header label={headerLabel} title={headerTitle} />
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
