import { type z } from "zod";
import { type UseFormReturn } from "react-hook-form";
import Link from "next/link";
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

interface LoginFormProps {
	form: UseFormReturn<z.infer<typeof LoginSchema>>;
	onSubmit: (values: z.infer<typeof LoginSchema>) => void;
	isPending: boolean;
}

export const LoginForm = ({ form, onSubmit, isPending }: LoginFormProps) => {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="login-form">
				<div className="space-y-4">
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
										placeholder={labels.passwordExample}
										type="password"
										disabled={isPending}
										className="loginPage__input"
									/>
								</FormControl>
								<Button size="sm" variant="link" asChild className="px-0 font-normal">
									<Link href="/reset">{labels.forgotPassword}</Link>
								</Button>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button disabled={isPending} type="submit" className="w-full">
					{labels.login}
				</Button>
			</form>
		</Form>
	);
};
