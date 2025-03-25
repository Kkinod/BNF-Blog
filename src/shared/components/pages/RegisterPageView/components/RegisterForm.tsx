import { type z } from "zod";
import { type UseFormReturn } from "react-hook-form";
import { type RegisterSchema } from "../../../../../../schemas";
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
import { usePasswordSecurity } from "@/hooks/usePasswordSecurity";

interface RegisterFormProps {
	form: UseFormReturn<z.infer<typeof RegisterSchema>>;
	onSubmit: (values: z.infer<typeof RegisterSchema>) => void;
	isPending: boolean;
	error?: string;
}

export const RegisterForm = ({ form, onSubmit, isPending, error }: RegisterFormProps) => {
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
