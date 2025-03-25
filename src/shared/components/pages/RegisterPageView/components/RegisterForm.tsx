import { useState, useEffect, useRef } from "react";
import { type z } from "zod";
import { type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { type RegisterSchema } from "../../../../../../schemas";
import { checkPasswordInHibp } from "../../../../../../actions/check-password";
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
import { FormError } from "@/shared/components/molecules/FormError/FormError";
import { labels } from "@/shared/utils/labels";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { AnimatedText } from "@/shared/components/atoms/AnimatedText/AnimatedText";

interface RegisterFormProps {
	form: UseFormReturn<z.infer<typeof RegisterSchema>>;
	onSubmit: (values: z.infer<typeof RegisterSchema>) => void;
	isPending: boolean;
	error?: string;
}

enum PasswordStrength {
	UNKNOWN = "unknown",
	CHECKING = "checking",
	COMPROMISED = "compromised",
	SECURE = "secure",
}

export const RegisterForm = ({ form, onSubmit, isPending, error }: RegisterFormProps) => {
	const [passwordState, setPasswordState] = useState<PasswordStrength>(PasswordStrength.UNKNOWN);
	const lastRequestId = useRef(0);

	const password = form.watch("password");
	const debouncedPassword = useDebouncedValue(password, 500);

	// Check password only after successful schema validation (Zod)
	useEffect(() => {
		const runValidation = async () => {
			if (!debouncedPassword || debouncedPassword.length === 0) {
				setPasswordState(PasswordStrength.UNKNOWN);
				return;
			}

			const isValid = await form.trigger("password");
			if (!isValid) {
				setPasswordState(PasswordStrength.UNKNOWN);
				return;
			}

			const currentRequestId = ++lastRequestId.current;
			setPasswordState(PasswordStrength.CHECKING);

			try {
				const result = await checkPasswordInHibp(debouncedPassword);

				// Ignore results from outdated requests
				if (currentRequestId !== lastRequestId.current) return;

				if (result.isCompromised) {
					setPasswordState(PasswordStrength.COMPROMISED);
					toast.error(labels.passwordSecurityWeak);
				} else {
					setPasswordState(PasswordStrength.SECURE);
					toast.success(labels.passwordSecurityStrong);
				}
			} catch (err) {
				// Ignore errors from outdated requests
				if (currentRequestId !== lastRequestId.current) return;
				console.error("Error checking password:", err);
				setPasswordState(PasswordStrength.UNKNOWN);
			}
		};

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		runValidation();
	}, [debouncedPassword, form]);

	// Determine if the submit button should be disabled
	const isSubmitDisabled = () => {
		return (
			isPending ||
			passwordState === PasswordStrength.CHECKING ||
			passwordState === PasswordStrength.COMPROMISED ||
			passwordState === PasswordStrength.UNKNOWN
		);
	};

	// Render animated message when checking password
	const renderPasswordMessage = () => {
		if (passwordState === PasswordStrength.CHECKING) {
			return (
				<AnimatedText
					text={labels.passwordSecurityChecking}
					className="mt-1 text-xs text-muted-foreground"
				/>
			);
		}
		return null;
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{labels.name}</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="John Doe"
										disabled={isPending}
										className="loginPage__input"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
								{renderPasswordMessage()}
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{labels.confirmPassword}</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="******"
										type="password"
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
				<Button disabled={isSubmitDisabled()} type="submit" className="w-full">
					{labels.register}
				</Button>
			</form>
		</Form>
	);
};
