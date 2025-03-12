import { type z } from "zod";
import { type UseFormReturn } from "react-hook-form";
import { type LoginSchema } from "../../../../../../schemas";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/atoms/formElements/form";
import { Input } from "@/shared/components/atoms/formElements/input";
import { Button } from "@/shared/components/ui/button";
import { labels } from "@/shared/utils/labels";

interface TwoFactorFormProps {
	form: UseFormReturn<z.infer<typeof LoginSchema>>;
	onSubmit: (values: z.infer<typeof LoginSchema>) => void;
	isPending: boolean;
	timeRemaining: number;
	isExpired: boolean;
	formatTime: (seconds: number) => string;
	handleResendCode: () => void;
	expiresAt: number | null;
}

export const TwoFactorForm = ({
	form,
	onSubmit,
	isPending,
	timeRemaining,
	isExpired,
	formatTime,
	handleResendCode,
	expiresAt,
}: TwoFactorFormProps) => {
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6"
				data-testid="two-factor-form"
			>
				<div className="space-y-4">
					<FormField
						control={form.control}
						name="code"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{labels.twoFactorCode}</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="123456"
										disabled={isPending}
										className="loginPage__input"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{expiresAt && !isExpired && (
						<div className="text-sm text-muted-foreground">
							{labels.twoFactorCodeExpires} {formatTime(timeRemaining)}
						</div>
					)}
					{isExpired && (
						<div className="flex flex-col space-y-2">
							<div className="text-sm text-destructive">{labels.twoFactorCodeExpired}</div>
							<Button
								type="button"
								variant="outline"
								onClick={handleResendCode}
								disabled={isPending || !isExpired}
							>
								{labels.twoFactorResendCode}
							</Button>
						</div>
					)}
				</div>
				<Button disabled={isPending} type="submit" className="w-full">
					{labels.confirm}
				</Button>
			</form>
		</Form>
	);
};
