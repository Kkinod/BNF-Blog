"use client";
// import {
// 	// signIn,
// 	useSession,
// } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { Button } from "@/components/atoms/Button/Button";
// import { LoginButton } from "@/components/atoms/LoginButton/LoginButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { LoginSchema } from "../../../../schemas";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/atoms/formElements/form";
import { LoginCardWrapper } from "@/components/atoms/LoginCardWrapper/LoginCardWrapper";
import { Input } from "@/components/atoms/formElements/input";
import { FormError } from "@/components/molecules/FormError/FormError";
import { Button } from "@/components/ui/button";

import "./loginPageView.css";
import { FormSuccess } from "@/components/molecules/FormSuccess/FormSuccess";

export const LoginPageView = () => {
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
		console.log(values);
	};

	return (
		<div className="loginPage__container">
			<LoginCardWrapper
				headerLabel={"Welcome Back"}
				backButtonLabel={"Don't have an account?"}
				backButtonHref={"/auth/register"}
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
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} placeholder="example@example.com" type="email" />
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
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input {...field} placeholder="******" type="password" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormError message="" />
						<FormSuccess message="" />
						<Button type="submit" className="w-full">
							Login
						</Button>
					</form>
				</Form>
			</LoginCardWrapper>
		</div>
	);
};
