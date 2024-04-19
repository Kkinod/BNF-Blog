import { Resend } from "resend";
import { labels } from "@/views/labels";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `http://localhost:3000/new-verification?token=${token}`;

	await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: labels.pleaseConfirmYourEmail,
		html: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`,
	});
};
