"use client";
// import {
// 	// signIn,
// 	useSession,
// } from "next-auth/react";
// import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
// import { Button } from "@/components/atoms/Button/Button";
// import { LoginButton } from "@/components/atoms/LoginButton/LoginButton";
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
	// const { status } = useSession();

	// const router = useRouter();

	// useEffect(() => {
	// 	if (status === "authenticated") {
	// 		router.push("/");
	// 	}
	// }, [status, router]);

	// if (status === "loading") {
	// 	return <div className="loading">Loading...</div>;
	// }

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		setError("");
		setSuccess("");

		//TODO: problemy:
		// 2. Po wpisaniu błędnego hasła i tak nas przenosi na 2F code i dopiero po wpisaniu

		// startTransition(() => {
		// 	login(values)
		// 		.then((data) => {
		// 			if (data?.error) {
		// 				if (!showTwoFactor) {
		// 					form.reset();
		// 				}
		// 				setError(data?.error);
		// 			}

		// 			if (data?.success) {
		// 				form.reset();
		// 				setSuccess(data?.success);
		// 			}

		// 			console.log("DATA", data);

		// 			if (data?.twoFactor) {
		// 				setShowTwoFactor(true);
		// 			}
		// 		})
		// 		.catch(() => setError(labels.errors.somethingWentWrong));
		// });
		startTransition(async () => {
			try {
				const data = await login(values);

				if (data?.error) {
					if (!showTwoFactor) {
						form.reset();
					}
					setError(data?.error);
					// form.reset();
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
			>
				{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
				{/* <div className="loginPage__socialButton" onClick={() => signIn("google")}>
					Sign in with Google
				</div>
				<div className="loginPage__socialButton">Sign in with Github</div>
				<div className="loginPage__socialButton">Sign in with Facebook</div> */}
				{/* <LoginButton>
					<Button size="lg">Sign in</Button>
				</LoginButton> */}
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
												<Input {...field} placeholder="123456" disabled={isPending} />
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
