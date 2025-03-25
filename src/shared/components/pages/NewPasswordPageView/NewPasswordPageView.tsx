"use client";

import { useState, useTransition } from "react";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { NewPasswordSchema } from "../../../../../schemas";
import { newPassword } from "../../../../../actions/new-password";
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
import { AnimatedText } from "@/shared/components/atoms/AnimatedText/AnimatedText";
import { labels } from "@/shared/utils/labels";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePasswordSecurity } from "@/hooks/usePasswordSecurity";
import "../LoginPageView/loginPageView.css";

export const NewPasswordPageView = () => {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: "",
		},
	});

	const password = form.watch("password");
	const debouncedPassword = useDebouncedValue(password, 500);

	const {
		isCheckingPassword,
		isPasswordCompromised,
		isSecurityCheckPassed,
		renderPasswordMessage,
	} = usePasswordSecurity({
		debouncedPassword,
		form,
	});

	const isSubmitDisabled = () => {
		return isPending || isCheckingPassword || isPasswordCompromised || !isSecurityCheckPassed;
	};

	const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
		setError("");
		setSuccess("");

		startTransition(() => {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			newPassword(values, token).then((data) => {
				setError(data?.error);
				setSuccess(data?.success);
			});
		});
	};

	return (
		<div className="loginPage__container">
			<CardWrapper
				headerLabel={labels.enterANewPassword}
				backButtonLabel={labels.backToLogin}
				backButtonHref={"/login"}
				headerTitle={labels.newPassword}
			>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-4">
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
												onBlur={() => {
													// Trigger validation when user leaves the field
													if (field.value) {
														// eslint-disable-next-line @typescript-eslint/no-floating-promises
														form.trigger("password");
													}
												}}
											/>
										</FormControl>
										{renderPasswordMessage() && (
											<AnimatedText
												text={renderPasswordMessage()!.text}
												className={renderPasswordMessage()!.className}
											/>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormError message={error} />
						<FormSuccess message={success} />
						<Button disabled={isSubmitDisabled()} type="submit" className="w-full">
							{labels.resetPassword}
						</Button>
					</form>
				</Form>
			</CardWrapper>
		</div>
	);
};
