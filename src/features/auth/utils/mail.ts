import { Resend } from "resend";
import { labels } from "@/shared/utils/labels";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetLink = `${process.env.NEXTAUTH_URL}/new-password?token=${token}`;
	const currentTime = new Date();
	const expirationTime = new Date(currentTime.getTime() + 1800 * 1000); // 30 minut
	const formattedExpirationTime = expirationTime.toLocaleTimeString();

	await resend.emails.send({
		from: "no-reply@bnf-blog.com",
		to: email,
		subject: labels.resetYourPassword,
		html: `
			<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
				<h2>Reset hasła</h2>
				<p>Otrzymaliśmy prośbę o zresetowanie hasła dla Twojego konta.</p>
				<p>Kliknij poniższy przycisk, aby zresetować hasło:</p>
				<div style="text-align: center; margin: 20px 0;">
					<a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
						Resetuj hasło
					</a>
				</div>
				<p>Link wygaśnie o ${formattedExpirationTime} (za 30 minut od otrzymania).</p>
				<p style="color: #666; font-size: 12px;">
					Ważne informacje bezpieczeństwa:
					<ul>
						<li>Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość lub skontaktuj się z administracją</li>
						<li>Nigdy nie udostępniaj tego linku innym osobom</li>
						<li>Upewnij się, że adres URL zaczyna się od ${process.env.NEXTAUTH_URL}</li>
					</ul>
				</p>
				<p>Data i czas wysłania: ${currentTime.toLocaleString()}</p>
			</div>
		`,
	});
};

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${process.env.NEXTAUTH_URL}/new-verification?token=${token}`;
	const currentTime = new Date();
	const expirationTime = new Date(currentTime.getTime() + 3600 * 1000 * 24); // 24 godziny
	const formattedExpirationTime =
		expirationTime.toLocaleDateString() + " " + expirationTime.toLocaleTimeString();

	await resend.emails.send({
		from: "no-reply@bnf-blog.com",
		to: email,
		subject: labels.pleaseConfirmYourEmail,
		html: `
			<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
				<h2>Weryfikacja adresu email</h2>
				<p>Dziękujemy za rejestrację! Potwierdź swój adres email, aby aktywować konto.</p>
				<p>Kliknij poniższy przycisk, aby zweryfikować adres email:</p>
				<div style="text-align: center; margin: 20px 0;">
					<a href="${confirmLink}" style="background-color: #4169E1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
						Potwierdź adres email
					</a>
				</div>
				<p>Link wygaśnie: ${formattedExpirationTime} (24 godziny od otrzymania).</p>
				<p style="color: #666; font-size: 12px;">
					Ważne informacje bezpieczeństwa:
					<ul>
						<li>Jeśli nie zakładałeś konta, zignoruj tę wiadomość</li>
						<li>Nigdy nie udostępniaj tego linku innym osobom</li>
						<li>Upewnij się, że adres URL zaczyna się od ${process.env.NEXTAUTH_URL}</li>
					</ul>
				</p>
				<p>Data i czas wysłania: ${currentTime.toLocaleString()}</p>
			</div>
		`,
	});
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	const currentTime = new Date();
	const expirationTime = new Date(currentTime.getTime() + 300 * 1000);
	const formattedExpirationTime = expirationTime.toLocaleTimeString();

	await resend.emails.send({
		from: "no-reply@bnf-blog.com",
		to: email,
		subject: labels.twoFACode,
		html: `
			<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
				<h2>Twój kod weryfikacji dwuskładnikowej (2FA)</h2>
				<p>Kod: <strong>${token}</strong></p>
				<p>Ten kod wygaśnie o ${formattedExpirationTime} (za 5 minut od otrzymania).</p>
				<p>Jeżeli nie próbowałeś się zalogować, prosimy o zignorowanie tej wiadomości i rozważenie zmiany hasła.</p>
				<p style="color: #666; font-size: 12px;">
					Ważne informacje bezpieczeństwa:
					<ul>
						<li>Nigdy nie udostępniaj tego kodu innym osobom</li>
						<li>Nasi pracownicy nigdy nie poproszą Cię o podanie tego kodu</li>
						<li>Kod jest ważny tylko przez 5 minut</li>
					</ul>
				</p>
				<p>Data i czas wysłania: ${currentTime.toLocaleString()}</p>
			</div>
		`,
	});
};
