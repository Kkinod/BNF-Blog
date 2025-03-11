"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { toast } from "sonner";
import { RegisterSchema } from "../../../../../schemas";
import { register } from "../../../../../actions/register";
import { resendVerificationEmail } from "../../../../../actions/resend-verification";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/atoms/formElements/form";
import { CardWrapper } from "@/shared/components/organisms/CardWrapper/CardWrapper";
import { Input } from "@/shared/components/atoms/formElements/input";
import { FormError } from "@/shared/components/molecules/FormError/FormError";
import { Button } from "@/shared/components/ui/button";
import { FormSuccess } from "@/shared/components/molecules/FormSuccess/FormSuccess";
import { labels } from "@/shared/utils/labels";
import { routes } from "@/shared/utils/routes";
import "../LoginPageView/loginPageView.css";

export const RegisterPageView = () => {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();
	const [showVerification, setShowVerification] = useState<boolean>(false);
	const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: "",
			password: "",
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
				console.error("Resend Verification Error:", error);
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
			>
				{!showVerification ? (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{labels.name}</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="John Doe"
													disabled={isPending}
													className="loginPage__input"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{labels.email}</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="example@example.com"
													type="email"
													disabled={isPending}
													className="loginPage__input"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{labels.password}</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="******"
													type="password"
													disabled={isPending}
													className="loginPage__input"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormError message={error} />
							<Button disabled={isPending} type="submit" className="w-full">
								{labels.register}
							</Button>
						</form>
					</Form>
				) : (
					<div className="space-y-6">
						<div className="flex flex-col items-center justify-center space-y-2 text-center">
							<FormSuccess message={success} />
							<p className="text-sm text-muted-foreground">
								{labels.verificationEmailInformation}
							</p>
							<div className="mt-4 flex w-full flex-col space-y-2">
								<Button
									type="button"
									variant="outline"
									onClick={handleResendVerification}
									disabled={isPending || isResendDisabled}
									className="w-full"
								>
									{labels.resendVerificationEmail}
								</Button>
							</div>
						</div>
					</div>
				)}
			</CardWrapper>
		</div>
	);
};
