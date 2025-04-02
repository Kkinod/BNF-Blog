import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";

import { type SettingsSchema } from "../../../../../../schemas";
import { labels } from "@/shared/utils/labels";
import { AnimatedText } from "@/shared/components/atoms/AnimatedText/AnimatedText";
import {
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/atoms/formElements/form";
import { Input } from "@/shared/components/atoms/formElements/input";

interface PasswordSectionProps {
	form: UseFormReturn<z.infer<typeof SettingsSchema>>;
	isPending: boolean;
	isCheckingPassword: boolean;
	renderPasswordMessage: () => { text: string; className: string } | null;
}

export const PasswordSection = ({
	form,
	isPending,
	renderPasswordMessage,
}: PasswordSectionProps) => {
	return (
		<>
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
	);
};
