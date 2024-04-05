"use client";

import { useState, useTransition } from "react";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import "./registerPageView.css";
import { labels } from "@/views/labels";

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
				setError(data.error);
				setSuccess(data.success);
			});
		});
	};

	return (
		<div className="loginPage__container">
			<CardWrapper
				headerLabel={labels.createAnAccount}
				backButtonLabel={labels.alreadyHaveAnAccount}
				backButtonHref={"/login"}
				showSocial
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
											<Input {...field} placeholder="John Doe" disabled={isPending} />
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
							{labels.register}
						</Button>
					</form>
				</Form>
			</CardWrapper>
		</div>
	);
};
