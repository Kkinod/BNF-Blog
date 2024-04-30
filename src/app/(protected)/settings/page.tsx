"use client";

import { useTransition, useState } from "react";
import { type z } from "zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { settings } from "../../../../actions/settings";
import { SettingsSchema } from "../../../../schemas";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { labels } from "@/views/labels";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
	Form,
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormDescription,
	FormMessage,
} from "@/components/atoms/formElements/form";
import { Input } from "@/components/atoms/formElements/input";
import { FormSuccess } from "@/components/molecules/FormSuccess/FormSuccess";
import { FormError } from "@/components/molecules/FormError/FormError";

const SettingPage = () => {
	const user = useCurrentUser();

	const [error, setError] = useState<string | undefined>();
	const [success, setsuccess] = useState<string | undefined>();
	const { update } = useSession();
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			password: undefined,
			newPassword: undefined,
			name: user?.name || undefined,
			email: user?.email || undefined,
			role: user?.role || undefined,
			isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
		},
	});

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		startTransition(() => {
			settings(values)
				.then((data) => {
					if (data.error) {
						setError(data.error);
					}

					if (data.success) {
						// eslint-disable-next-line @typescript-eslint/no-floating-promises
						update();
						setsuccess(data.success);
					}
				})
				.catch(() => {
					setError(labels.errors.somethingWentWrong);
				});
		});
	};

	return (
		<Card className="w-[600px]">
			<CardHeader>
				<p className="text-center text-2xl font-semibold">Settings</p>
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
											defaultValue={field.value}
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
													checked={field.value}
													onCheckedChange={field.onChange}
													// className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							)}
						</div>
						<FormError message={error} />
						<FormSuccess message={success} />
						<Button disabled={isPending} type="submit">
							{labels.save}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default SettingPage;
