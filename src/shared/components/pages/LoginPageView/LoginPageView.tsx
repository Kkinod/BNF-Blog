"use client";

import { useState, useTransition, useEffect } from "react";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { LoginSchema } from "../../../../../schemas";
import { login } from "../../../../../actions/login";
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
import { Button } from "@/shared/components/ui/button";
import { labels } from "@/shared/utils/labels";
import { routes } from "@/shared/utils/routes";
import "./loginPageView.css";

export const LoginPageView = () => {
	const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
	const [isPending, startTransition] = useTransition();
	const [expiresAt, setExpiresAt] = useState<number | null>(null);
	const [timeRemaining, setTimeRemaining] = useState<number>(0);
	const [isExpired, setIsExpired] = useState<boolean>(false);

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
			code: "",
		},
	});

	useEffect(() => {
		if (!expiresAt) return;

		const calculateTimeRemaining = () => {
			const now = Date.now();
			const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
			setTimeRemaining(remaining);
			setIsExpired(remaining <= 0);
		};

		calculateTimeRemaining();
		const interval = setInterval(calculateTimeRemaining, 1000);

		return () => clearInterval(interval);
	}, [expiresAt]);

	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const handleResendCode = () => {
		if (!isExpired) return;

		const email = form.getValues("email");
		const password = form.getValues("password");

		if (!email || !password) {
			toast.error(labels.errors.emailIsRequired);
			return;
		}

		startTransition(async () => {
			try {
				const data = await login({ email, password });

				if (data?.error) {
					toast.error(data.error);
				} else if (data?.twoFactor) {
					setExpiresAt(data.expiresAt);
					setIsExpired(false);
					toast.success(labels.twoFactorCodeResent);
				}
			} catch (error) {
				toast.error(labels.errors.somethingWentWrong);
				console.error("Resend Code Error:", error);
			}
		});
	};

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
				} else if (data?.success) {
					toast.success(data?.success || "");
					form.reset();
				}

				if (data?.twoFactor) {
					setShowTwoFactor(true);
					setExpiresAt(data.expiresAt);
					toast.info(labels.twoFactorCodeSent);
				}
			} catch (error) {
				toast.error(labels.errors.somethingWentWrong);
				console.error("Login Error:", error);
			}
		});
	};

	return (
		<div className="loginPage__container">
			<CardWrapper
				headerLabel={labels.welcomeBack}
				backButtonLabel={labels.dontHaveAnAccount}
				backButtonHref={routes.register}
				showSocial
				headerTitle={labels.login}
			>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
						data-testid="login-form"
					>
						<div className="space-y-4">
							{showTwoFactor && (
								<>
									<FormField
										control={form.control}
										name="code"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{labels.twoFactorCode}</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder="123456"
														disabled={isPending}
														className="loginPage__input"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									{expiresAt && !isExpired && (
										<div className="text-sm text-muted-foreground">
											{labels.twoFactorCodeExpires} {formatTime(timeRemaining)}
										</div>
									)}
									{isExpired && (
										<div className="flex flex-col space-y-2">
											<div className="text-sm text-destructive">{labels.twoFactorCodeExpired}</div>
											<Button
												type="button"
												variant="outline"
												onClick={handleResendCode}
												disabled={isPending || !isExpired}
											>
												{labels.twoFactorResendCode}
											</Button>
										</div>
									)}
								</>
							)}
							{!showTwoFactor && (
								<>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{labels.email}</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder={labels.emailExample}
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
														placeholder={labels.passwordExample}
														type="password"
														disabled={isPending}
														className="loginPage__input"
													/>
												</FormControl>
												<Button size="sm" variant="link" asChild className="px-0 font-normal">
													<Link href="/reset">{labels.forgotPassword}</Link>
												</Button>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}
						</div>
						<Button disabled={isPending} type="submit" className="w-full">
							{showTwoFactor ? labels.confirm : labels.login}
						</Button>
					</form>
				</Form>
			</CardWrapper>
		</div>
	);
};
