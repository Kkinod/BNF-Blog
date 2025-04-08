"use client";

import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";

import { type SettingsSchema } from "../../../../../../schemas";
import {
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/atoms/formElements/form";
import { Input } from "@/shared/components/atoms/formElements/input";
import { useTranslation } from "@/hooks/useTranslation";
import { labels } from "@/shared/utils/labels";

interface UserInfoSectionProps {
	form: UseFormReturn<z.infer<typeof SettingsSchema>>;
	isPending: boolean;
	isOAuth: boolean;
}

export const UserInfoSection = ({ form, isPending }: UserInfoSectionProps) => {
	const { t } = useTranslation();

	return (
		<>
			<FormField
				control={form.control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>{t("name", { defaultValue: "Name" })}</FormLabel>
						<FormControl>
							<Input
								{...field}
								placeholder={t("userInfoSection.johnDoe", {
									defaultValue: labels.userInfoSection.johnDoe,
								})}
								disabled={isPending}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	);
};
