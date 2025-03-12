"use client";

import { useTransition } from "react";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoginSchema } from "../../../../../schemas";
import { login } from "../../../../../actions/login";
import { useEmailVerification } from "../../../../hooks/auth/useEmailVerification";
import { useTwoFactorAuth } from "../../../../hooks/auth/useTwoFactorAuth";
import { LoginForm, TwoFactorForm, VerificationView } from "./components";
import { CardWrapper } from "@/shared/components/organisms/CardWrapper/CardWrapper";
import { labels } from "@/shared/utils/labels";
import { routes } from "@/shared/utils/routes";
import "./loginPageView.css";

export const LoginPageView = () => {
	const {
		showTwoFactor,
		expiresAt,
		timeRemaining,
		isExpired,
		formatTime,
		isPending: isTwoFactorPending,
		handleResendCode,
		startTwoFactorAuth,
	} = useTwoFactorAuth();

	const {
		showVerification,
		isResendDisabled,
		resendTimeRemaining,
		isPending: isVerificationPending,
		handleResendVerification,
		startVerification,
		setShowVerification,
		setVerificationEmail,
	} = useEmailVerification();

	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
			code: "",
		},
	});

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		if (showTwoFactor && (!values.code || values.code.trim() === "")) {
			toast.error(labels.errors.codeRequired || "");
			return;
		}

		startTransition(async () => {
			try {
				const data = await login(values);

				if (data?.error) {
					if (data && data.status === 429) {
						toast.error(data.error);
					} else {
						if (!showTwoFactor) {
							form.reset();
						}

						toast.error(data?.error);
					}
				} else if (data?.success && !data?.verification) {
					toast.success(data?.success || "");
					form.reset();
				} else if (data?.verification) {
					setShowVerification(true);
					setVerificationEmail(values.email);
					form.reset();

					if (data.waitTimeSeconds && data.waitTimeSeconds > 0) {
						startVerification(values.email, data.waitTimeSeconds);
					}
				}

				if (data?.twoFactor) {
					startTwoFactorAuth(data.expiresAt);
					toast.info(labels.twoFactorCodeSent);
				}
			} catch (error) {
				toast.error(labels.errors.somethingWentWrong);
				console.error("Login Error:", error);
			}
		});
	};

	const isFormPending = isPending || isTwoFactorPending || isVerificationPending;

	return (
		<div className="loginPage__container">
			<CardWrapper
				headerLabel={showVerification ? labels.pleaseVerifyYourEmail : labels.welcomeBack}
				backButtonLabel={labels.dontHaveAnAccount}
				backButtonHref={routes.register}
				showSocial={!showVerification}
				headerTitle={showVerification ? labels.verification : labels.login}
			>
				{showVerification ? (
					<VerificationView
						handleResendVerification={handleResendVerification}
						isPending={isFormPending}
						isResendDisabled={isResendDisabled}
						resendTimeRemaining={resendTimeRemaining}
						formatTime={formatTime}
					/>
				) : showTwoFactor ? (
					<TwoFactorForm
						form={form}
						onSubmit={onSubmit}
						isPending={isFormPending}
						timeRemaining={timeRemaining}
						isExpired={isExpired}
						formatTime={formatTime}
						handleResendCode={() =>
							handleResendCode(form.getValues("email"), form.getValues("password"))
						}
						expiresAt={expiresAt}
					/>
				) : (
					<LoginForm form={form} onSubmit={onSubmit} isPending={isFormPending} />
				)}
			</CardWrapper>
		</div>
	);
};
