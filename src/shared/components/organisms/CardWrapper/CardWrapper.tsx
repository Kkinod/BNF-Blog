"use client";

import { Header } from "../../atoms/Header/Header";
import { CardContent, CardFooter, CardHeader } from "@/shared/components/ui/card";
import { Social } from "@/shared/components/molecules/Social/Social";
import { BackButton } from "@/shared/components/molecules/BackButton/BackButton";
import { SimpleLoader } from "@/shared/components/organisms/SimpleLoader";
import "./cardWrapper.css";

interface LoginCardWrapperProps {
	children: React.ReactNode;
	headerLabel: string;
	backButtonLabel: string;
	backButtonHref: string;
	showSocial?: boolean;
	headerTitle: string;
	isRegistrationEnabled?: boolean;
	isCheckingRegistration?: boolean;
}

export const CardWrapper = ({
	children,
	headerLabel,
	backButtonLabel,
	backButtonHref,
	showSocial,
	headerTitle,
	isRegistrationEnabled = true,
	isCheckingRegistration = false,
}: LoginCardWrapperProps) => {
	return (
		<div className="loginPage__wrapper">
			<CardHeader>
				<Header label={headerLabel} title={headerTitle} />
			</CardHeader>

			{isCheckingRegistration ? (
				<CardContent>
					<SimpleLoader size="medium" theme="default" />
				</CardContent>
			) : (
				<>
					<CardContent>{children}</CardContent>
					{showSocial && isRegistrationEnabled && (
						<CardFooter>
							<Social />
						</CardFooter>
					)}
				</>
			)}

			<CardFooter>
				<BackButton label={backButtonLabel} href={backButtonHref} />
			</CardFooter>
		</div>
	);
};
