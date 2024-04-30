"use client";

import { useTransition, useState } from "react";
import { type z } from "zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settings } from "../../../../actions/settings";
import { SettingsSchema } from "../../../../schemas";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { labels } from "@/views/labels";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
			name: user?.name || undefined,
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
						<div className="spave-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{labels.name}</FormLabel>
										<FormControl>
											<Input {...field} placeholder={labels.johnDoe} disabled={isPending} />
										</FormControl>
									</FormItem>
								)}
							/>
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
