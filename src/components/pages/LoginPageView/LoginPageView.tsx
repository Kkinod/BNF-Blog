"use client";

import { useState, useTransition } from "react";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LoginSchema } from "../../../../schemas";
import { login } from "../../../../actions/login";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/atoms/formElements/form";
import { CardWrapper } from "@/components/organisms/CardWrapper/CardWrapper";
import { Input } from "@/components/atoms/formElements/input";
import { FormError } from "@/components/molecules/FormError/FormError";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/molecules/FormSuccess/FormSuccess";
import { labels } from "@/views/labels";
import { routes } from "@/utils/routes";
import "./loginPageView.css";

export const LoginPageView = () => {
	const searchParams = useSearchParams();
	const urlError =
		searchParams.get("error") === "OAuthAccountNotLinked"
			? labels.errors.emailAlreadyInUseWithDifferentProvider
			: "";

	const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
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
		setError("");
		setSuccess("");

		startTransition(async () => {
			try {
				const data = await login(values);

				if (data?.error) {
					if (!showTwoFactor) {
						form.reset();
					}
					setError(data?.error);
				} else if (data?.success) {
					setSuccess(data?.success);
					form.reset();
				}

				if (data?.twoFactor) {
					setShowTwoFactor(true);
				}
			} catch (error) {
				setError(labels.errors.somethingWentWrong);
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
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-4">
							{showTwoFactor && (
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
						<FormError message={error || urlError} />
						<FormSuccess message={success} />
						<Button disabled={isPending} type="submit" className="w-full">
							{showTwoFactor ? labels.confirm : labels.login}
						</Button>
					</form>
				</Form>
			</CardWrapper>
		</div>
	);
};
