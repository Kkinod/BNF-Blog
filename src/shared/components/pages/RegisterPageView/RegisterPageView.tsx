"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { toast } from "sonner";
import { RegisterSchema } from "../../../../../schemas";
import { register } from "../../../../../actions/register";
import { resendVerificationEmail } from "../../../../../actions/resend-verification";
import { RegisterForm, VerificationInfo } from "./components";
import { CardWrapper } from "@/shared/components/organisms/CardWrapper/CardWrapper";
import { labels } from "@/shared/utils/labels";
import { routes } from "@/shared/utils/routes";
import "../LoginPageView/loginPageView.css";

interface RegistrationResponse {
	isRegistrationEnabled: boolean;
}

export const RegisterPageView = () => {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const [showVerification, setShowVerification] = useState<boolean>(false);
	const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
	const [isRegistrationEnabled, setIsRegistrationEnabled] = useState<boolean>(true);
	const [isCheckingRegistration, setIsCheckingRegistration] = useState<boolean>(true);

	useEffect(() => {
		const checkRegistrationEnabled = async () => {
			try {
				const response = await fetch("/api/admin/registration");
				const data = (await response.json()) as RegistrationResponse;

				setIsRegistrationEnabled(data.isRegistrationEnabled);
			} catch (error) {
				if (process.env.NODE_ENV === "development") {
					console.error("Registration check failed:", error);
				}
				setIsRegistrationEnabled(true);
			} finally {
				setIsCheckingRegistration(false);
			}
		};

		void checkRegistrationEnabled();
	}, []);

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			name: "",
		},
	});

	const handleResendVerification = () => {
		const email = form.getValues("email");

		if (!email) {
			toast.error(labels.errors.emailIsRequired);
			return;
		}

		setIsResendDisabled(true);

		startTransition(async () => {
			try {
				const data = await resendVerificationEmail(email);

				if ("error" in data) {
					if (data.status === 429) {
						toast.error(data.error);
					} else {
						setError(data.error);
					}
				} else if ("success" in data) {
					setSuccess(data.success);
					toast.success(labels.verificationEmailSent);
				}
			} catch (error) {
				toast.error(labels.errors.somethingWentWrong);
				if (process.env.NODE_ENV === "development") {
					console.error("Resend Verification Error:", error);
				}
			} finally {
				setIsResendDisabled(false);
			}
		});
	};

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			register(values).then((data) => {
				if (data.error) {
					if (data.status === 429) {
						toast.error(data.error);
					} else {
						setError(data.error);
					}
				}

				if (data.success) {
					setSuccess(data.success);

					if (data.verification) {
						setShowVerification(true);
					} else {
						form.reset();
					}
				}
			});
		});
	};

	return (
		<div className="loginPage__container">
			<CardWrapper
				headerLabel={showVerification ? labels.pleaseVerifyYourEmail : labels.createAnAccount}
				backButtonLabel={labels.alreadyHaveAnAccount}
				backButtonHref={routes.login}
				showSocial={!showVerification}
				headerTitle={showVerification ? labels.verification : labels.register}
				isRegistrationEnabled={isRegistrationEnabled}
				isCheckingRegistration={isCheckingRegistration}
			>
				{!isRegistrationEnabled ? (
					<div className="flex flex-col items-center justify-center p-4 text-center">
						<p className="font-semibold text-destructive">{labels.registrationCurrentlyDisabled}</p>
						<p className="mt-2 text-sm text-muted-foreground">
							{labels.registrationDisabledMessage}
						</p>
					</div>
				) : !showVerification ? (
					<RegisterForm form={form} onSubmit={onSubmit} isPending={isPending} error={error} />
				) : (
					<VerificationInfo
						success={success}
						onResendVerification={handleResendVerification}
						isPending={isPending}
						isResendDisabled={isResendDisabled}
					/>
				)}
			</CardWrapper>
		</div>
	);
};
