import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";

import { type SettingsSchema } from "../../../../../../schemas";
import { labels } from "@/shared/utils/labels";
import {
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/atoms/formElements/form";
import { Input } from "@/shared/components/atoms/formElements/input";

interface UserInfoSectionProps {
	form: UseFormReturn<z.infer<typeof SettingsSchema>>;
	isPending: boolean;
	isOAuth: boolean;
}

export const UserInfoSection = ({ form, isPending, isOAuth }: UserInfoSectionProps) => {
	return (
		<>
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
			{!isOAuth && (
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
			)}
		</>
	);
};
