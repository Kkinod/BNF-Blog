"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { toast } from "sonner";
import { RegisterSchema } from "../../../../schemas";
import { register } from "../../../../actions/register";
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
import "../LoginPageView/loginPageView.css";

export const RegisterPageView = () => {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
	});

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
					toast.success(data.success);
					setSuccess(data.success);
					form.reset();
				}
			});
		});
	};

	return (
		<div className="loginPage__container">
			<CardWrapper
				headerLabel={labels.createAnAccount}
				backButtonLabel={labels.alreadyHaveAnAccount}
				backButtonHref={routes.login}
				showSocial
				headerTitle={labels.register}
			>
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
						<FormSuccess message={success} />
						<Button disabled={isPending} type="submit" className="w-full">
							{labels.register}
						</Button>
					</form>
				</Form>
			</CardWrapper>
		</div>
	);
};
