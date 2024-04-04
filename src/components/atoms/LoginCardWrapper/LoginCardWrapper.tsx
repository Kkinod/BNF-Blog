"use client";

import { LoginCardHeader } from "../LoginCardHeader/LoginCardHeader";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Social } from "@/components/molecules/Social/Social";
import { BackButton } from "@/components/molecules/BackButton/BackButton";

import "./loginCardWrapper.css";

interface LoginCardWrapperProps {
	children: React.ReactNode;
	headerLabel: string;
	backButtonLabel: string;
	backButtonHref: string;
	showSocial?: boolean;
}

export const LoginCardWrapper = ({
	children,
	headerLabel,
	backButtonLabel,
	backButtonHref,
	showSocial,
}: LoginCardWrapperProps) => {
	return (
		<div className="loginPage__wrapper">
			<CardHeader>
				<LoginCardHeader label={headerLabel} />
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
