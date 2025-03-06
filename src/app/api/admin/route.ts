import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { currentRole } from "@/features/auth/utils/currentUser";

/**
 * Lista zaufanych domen, które mogą odpytywać to API.
 * Ważne dla bezpieczeństwa - zapobiega nieautoryzowanemu dostępowi z obcych domen.
 */
const TRUSTED_ORIGINS = ["https://trusted-origin.com"];

/**
 * Dodaje nagłówki bezpieczeństwa do odpowiedzi HTTP.
 *
 * @param headers - Obiekt Headers do którego dodawane są nagłówki
 *
 * Nagłówki:
 * - X-Content-Type-Options: nosniff - Zapobiega MIME-type sniffing, blokując ataki polegające na podszywaniu się pod inny typ zawartości
 * - X-Frame-Options: DENY - Zapobiega osadzaniu strony w ramkach (iframe), chroniąc przed atakami clickjacking
 * - Content-Security-Policy - Określa dozwolone źródła zasobów, chroniąc przed XSS i innymi atakami wstrzykiwania
 * - Strict-Transport-Security - Wymusza używanie HTTPS, chroniąc przed atakami man-in-the-middle
 */
const addSecurityHeaders = (headers: Headers): void => {
	headers.set("X-Content-Type-Options", "nosniff");
	headers.set("X-Frame-Options", "DENY");
	headers.set("Content-Security-Policy", "default-src 'self'");
	headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
};

/**
 * Dodaje nagłówki CORS (Cross-Origin Resource Sharing) do odpowiedzi HTTP.
 * Kontroluje, które domeny mogą komunikować się z API.
 *
 * @param headers - Obiekt Headers do którego dodawane są nagłówki
 * @param origin - Domena źródłowa żądania
 *
 * Nagłówki:
 * - Access-Control-Allow-Origin - Określa, które domeny mogą odpytywać API
 * - Access-Control-Allow-Methods - Określa dozwolone metody HTTP
 * - Access-Control-Allow-Headers - Określa dozwolone nagłówki w żądaniach
 */
const addCorsHeaders = (headers: Headers, origin?: string): void => {
	if (origin && TRUSTED_ORIGINS.includes(origin)) {
		headers.set("Access-Control-Allow-Origin", origin);
		headers.set("Access-Control-Allow-Methods", "GET");
		headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
	}
};

/**
 * Dodaje nagłówki kontrolujące cache przeglądarki.
 * Zapobiega cachowaniu odpowiedzi API, co jest szczególnie ważne dla danych wrażliwych.
 *
 * @param headers - Obiekt Headers do którego dodawane są nagłówki
 * @param isError - Czy odpowiedź jest błędem (wpływa na rodzaj nagłówków)
 *
 * Nagłówki:
 * - Cache-Control - Kontroluje zachowanie cache przeglądarki i pośredników
 * - Pragma - Starszy nagłówek dla kompatybilności z HTTP/1.0
 */
const addCacheHeaders = (headers: Headers, isError: boolean = false): void => {
	headers.set("Cache-Control", isError ? "no-store" : "no-store, must-revalidate");
	headers.set("Pragma", "no-cache");
};

/**
 * Obsługuje żądania GET do endpointu administratora.
 * Implementuje kontrolę dostępu, obsługę błędów i nagłówki bezpieczeństwa.
 *
 * @param request - Obiekt żądania HTTP
 * @returns Odpowiedź HTTP z odpowiednim statusem i nagłówkami
 */
export async function GET(request: Request) {
	// Inicjalizacja nagłówków i pobranie informacji o źródle żądania
	const headers = new Headers();
	const origin = request.headers.get("origin") || undefined;

	try {
		// Obsługa żądań preflight CORS (OPTIONS)
		// Przeglądarki wysyłają je przed właściwym żądaniem, aby sprawdzić uprawnienia
		if (request.method === "OPTIONS" && origin && TRUSTED_ORIGINS.includes(origin)) {
			addCorsHeaders(headers, origin);
			return new NextResponse(null, {
				status: 204, // No Content - standardowa odpowiedź dla preflight
				headers,
			});
		}

		// Walidacja metody HTTP - tylko GET jest dozwolone
		if (request.method !== "GET") {
			headers.set("Allow", "GET"); // Informuje klienta o dozwolonych metodach
			addSecurityHeaders(headers);
			addCacheHeaders(headers, true);
			return new NextResponse(null, {
				status: 405, // Method Not Allowed
				headers,
			});
		}

		// Pobranie roli użytkownika - główna logika biznesowa
		const role = await currentRole();

		// Dodanie standardowych nagłówków bezpieczeństwa do każdej odpowiedzi
		addSecurityHeaders(headers);
		addCorsHeaders(headers, origin);

		// Sprawdzenie uprawnień - tylko ADMIN ma dostęp
		if (role === UserRole.ADMIN) {
			addCacheHeaders(headers);
			return new NextResponse(null, {
				status: 200, // OK
				headers,
			});
		}

		// Brak uprawnień - odmowa dostępu
		addCacheHeaders(headers, true);
		return new NextResponse(null, {
			status: 403, // Forbidden
			headers,
		});
	} catch (error) {
		// Dodanie nagłówków bezpieczeństwa nawet w przypadku błędu
		addSecurityHeaders(headers);
		addCacheHeaders(headers, true);

		// Obsługa błędów związanych z bazą danych
		// Zwraca kod 503 (Service Unavailable) z informacją o ponownej próbie
		if (
			error instanceof Error &&
			(error.message.includes("Database connection failed") ||
				error.message.includes("Database timeout"))
		) {
			headers.set("Retry-After", "30"); // Sugeruje klientowi odczekanie 30 sekund
			return new NextResponse(null, {
				status: 503, // Service Unavailable
				headers,
			});
		}

		// Obsługa pozostałych błędów
		// Zwraca kod 500 (Internal Server Error) z ustrukturyzowaną informacją o błędzie
		headers.set("Content-Type", "application/json");
		return new NextResponse(
			JSON.stringify({
				error: "Internal Server Error",
				message: "An unexpected error occurred",
			}),
			{
				status: 500, // Internal Server Error
				headers,
			},
		);
	}
}
