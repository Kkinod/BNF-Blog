"use client";

import { useState, useTransition } from "react";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ResetSchema } from "../../../../../schemas";
import { reset } from "../../../../../actions/reset";
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
import "../LoginPageView/loginPageView.css";

export const ResetPageView = () => {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = (values: z.infer<typeof ResetSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			reset(values).then((data) => {
				if (data?.error) {
					if (data.status === 429) {
						toast.error(data.error);
					} else {
						setError(data?.error);
					}
				}

				if (data?.success) {
					setSuccess(data?.success);
					form.reset();
				}
			});
		});
	};

	return (
		<div className="loginPage__container">
			<CardWrapper
				headerLabel={labels.forgotYourPassword}
				backButtonLabel={labels.backToLogin}
				backButtonHref={"/login"}
				headerTitle={labels.resetPassword}
			>
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
							{labels.sendResetEmail}
						</Button>
					</form>
				</Form>
			</CardWrapper>
		</div>
	);
};
