"use client";

import { useTransition, useState } from "react";
import { type z } from "zod";
import { useSession, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { settings } from "../../../../../actions/settings";
import { SettingsSchema } from "../../../../../schemas";
import { UserInfoSection } from "./components/UserInfoSection";
import { PasswordSection } from "./components/PasswordSection";
import { RoleAndTwoFactorSection } from "./components/RoleAndTwoFactorSection";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePasswordSecurity } from "@/hooks/usePasswordSecurity";
import { labels } from "@/shared/utils/labels";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/atoms/formElements/form";
import { FormSuccess } from "@/shared/components/molecules/FormSuccess/FormSuccess";
import { FormError } from "@/shared/components/molecules/FormError/FormError";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";

export const SettingPageView = () => {
	const user = useCurrentUser();

	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	const { update } = useSession();
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			password: undefined,
			newPassword: undefined,
			confirmNewPassword: undefined,
			name: user?.name || undefined,
			email: user?.email || undefined,
			role: user?.role || undefined,
			isTwoFactorEnabled: user?.isTwoFactorEnabled ?? false,
		},
	});

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const watchedPassword: string | undefined = form.watch("newPassword");
	const newPassword = watchedPassword || "";
	const debouncedPassword = useDebouncedValue(newPassword, 500);

	const {
		isCheckingPassword,
		isPasswordCompromised,
		isSecurityCheckPassed,
		renderPasswordMessage,
	} = usePasswordSecurity({
		debouncedPassword,
		form,
		fieldName: "newPassword",
	});

	const isSubmitDisabled = () => {
		if (newPassword) {
			return isPending || isCheckingPassword || isPasswordCompromised || !isSecurityCheckPassed;
		}
		return isPending;
	};

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		setError(undefined);
		setSuccess(undefined);

		startTransition(() => {
			settings(values)
				.then((data) => {
					if (data.error) {
						setError(data.error);
						setSuccess(undefined);
					}

					if (data.success) {
						if (values.password || values.newPassword || values.confirmNewPassword) {
							form.reset({
								...values,
								password: undefined,
								newPassword: undefined,
								confirmNewPassword: undefined,
							});
							setSuccess(data.success);
							setTimeout(() => {
								void signOut();
							}, 500);
						} else {
							// eslint-disable-next-line @typescript-eslint/no-floating-promises
							update();
							setSuccess(data.success);
						}
						setError(undefined);
					}
				})
				.catch(() => {
					setError(labels.errors.somethingWentWrong);
					setSuccess(undefined);
				});
		});
	};

	return (
		<Card className="w-full max-w-[600px]">
			<CardHeader>
				<p className="text-center text-2xl font-semibold">{labels.settings}</p>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-4">
							<UserInfoSection form={form} isPending={isPending} isOAuth={user?.isOAuth ?? false} />
							{user?.isOAuth === false && (
								<PasswordSection
									form={form}
									isPending={isPending}
									isCheckingPassword={isCheckingPassword}
									renderPasswordMessage={renderPasswordMessage}
								/>
							)}
							<RoleAndTwoFactorSection
								form={form}
								isPending={isPending}
								isOAuth={user?.isOAuth ?? false}
							/>
						</div>
						<FormError message={error} />
						<FormSuccess message={success} />
						<Button disabled={isSubmitDisabled()} type="submit">
							{labels.save}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
