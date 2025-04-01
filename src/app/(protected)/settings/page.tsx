"use client";

import { useTransition, useState } from "react";
import { type z } from "zod";
import { useSession, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { settings } from "../../../../actions/settings";
import { SettingsSchema } from "../../../../schemas";
import { useCurrentUser } from "../../../hooks/auth/useCurrentUser";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePasswordSecurity } from "@/hooks/usePasswordSecurity";
import { AnimatedText } from "@/shared/components/atoms/AnimatedText/AnimatedText";
import { labels } from "@/shared/utils/labels";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import {
	Form,
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormDescription,
	FormMessage,
} from "@/shared/components/atoms/formElements/form";
import { Input } from "@/shared/components/atoms/formElements/input";
import { FormSuccess } from "@/shared/components/molecules/FormSuccess/FormSuccess";
import { FormError } from "@/shared/components/molecules/FormError/FormError";

const SettingPage = () => {
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

	const watchedPassword = form.watch("newPassword") as string | undefined;
	const newPassword = watchedPassword || "";
	const debouncedPassword = useDebouncedValue(newPassword, 500);

	// Use the password security hook for newPassword field
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
		// Disable submit if we're checking password or it's compromised
		// But only if a new password is being set (otherwise other settings could still be changed)
		if (newPassword) {
			return isPending || isCheckingPassword || isPasswordCompromised || !isSecurityCheckPassed;
		}
		return isPending;
	};

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		// Clear previous messages before sending a new request
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
						// If password was changed, reset password fields and sign out
						if (values.password || values.newPassword || values.confirmNewPassword) {
							form.reset({
								...values,
								password: undefined,
								newPassword: undefined,
								confirmNewPassword: undefined,
							});
							setSuccess(data.success);
							// Sign out after a short delay to show success message
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
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{labels.name}</FormLabel>
										<FormControl>
											<Input {...field} placeholder={labels.johnDoe} disabled={isPending} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{user?.isOAuth === false && (
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
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="newPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{labels.newPassword}</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder={labels.passwordExample}
														type="password"
														disabled={isPending}
														onBlur={() => {
															// Trigger validation when user leaves the field
															if (field.value) {
																// eslint-disable-next-line @typescript-eslint/no-floating-promises
																form.trigger("newPassword");
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
									<FormField
										control={form.control}
										name="confirmNewPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{labels.confirmPassword}</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder={labels.passwordExample}
														type="password"
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}

							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{labels.role}</FormLabel>
										<Select
											disabled={isPending}
											onValueChange={field.onChange}
											defaultValue={field.value as UserRole}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder={labels.selectARole} />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value={UserRole.ADMIN}>{labels.admin}</SelectItem>
												<SelectItem value={UserRole.USER}>{labels.user}</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							{user?.isOAuth === false && (
								<FormField
									control={form.control}
									name="isTwoFactorEnabled"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
											<div className="space-y-0.5">
												<FormLabel>{labels.twoFactorAuthentication}</FormLabel>
												<FormDescription>{labels.enableTwoFactorAuthentication}</FormDescription>
											</div>
											<FormControl>
												<Switch
													disabled={isPending}
													checked={Boolean(field.value)}
													onCheckedChange={field.onChange}
													className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							)}
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

export default SettingPage;
