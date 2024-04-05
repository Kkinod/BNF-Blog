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
import "./loginPageView.css";
import { labels } from "@/views/labels";

export const LoginPageView = () => {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
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

		startTransition(() => {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			login(values).then((data) => {
				setError(data.error);
				setSuccess(data.success);
			});
		});
	};

	return (
		<div className="loginPage__container">
			<CardWrapper
				headerLabel={labels.welcomeBack}
				backButtonLabel={labels.dontHaveAnAccount}
				backButtonHref={"/register"}
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
											<Input {...field} placeholder="******" type="password" disabled={isPending} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormError message={error} />
						<FormSuccess message={success} />
						<Button disabled={isPending} type="submit" className="w-full">
							{labels.login}
						</Button>
					</form>
				</Form>
			</CardWrapper>
		</div>
	);
};
