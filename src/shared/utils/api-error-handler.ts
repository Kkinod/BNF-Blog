import { NextResponse } from "next/server";
import { labels } from "./labels";

export type ApiErrorType = {
	name: string;
	message: string;
	status: number;
	allowedMethods?: string[];
};

export function createApiError(
	message: string,
	status: number = 500,
	name: string = "ApiError",
): ApiErrorType {
	return {
		name,
		message,
		status,
	};
}

export function createForbiddenError(message: string = labels.errors.forbidden): ApiErrorType {
	return createApiError(message, 403, "ForbiddenError");
}

export function createUnauthorizedError(
	message: string = labels.errors.unauthorized,
): ApiErrorType {
	return createApiError(message, 401, "UnauthorizedError");
}

export function createNotFoundError(message: string = labels.errors.pageNotFound): ApiErrorType {
	return createApiError(message, 404, "NotFoundError");
}

export function createServiceUnavailableError(
	message: string = labels.errors.somethingWentWrong,
): ApiErrorType {
	return createApiError(message, 503, "ServiceUnavailableError");
}

export function createMethodNotAllowedError(allowedMethods: string[] = ["GET"]): ApiErrorType {
	return {
		...createApiError(labels.errors.unauthorized, 405, "MethodNotAllowedError"),
		allowedMethods,
	};
}

export function isApiError(error: unknown): error is ApiErrorType {
	return (
		!!error &&
		typeof error === "object" &&
		"name" in error &&
		"message" in error &&
		"status" in error &&
		typeof (error as ApiErrorType).status === "number"
	);
}

// Checks if an error is a method not allowed error
export function isMethodNotAllowedError(
	error: unknown,
): error is ApiErrorType & { allowedMethods: string[] } {
	return (
		isApiError(error) &&
		error.name === "MethodNotAllowedError" &&
		"allowedMethods" in error &&
		Array.isArray((error as { allowedMethods?: unknown }).allowedMethods)
	);
}

// Checks if an error is a service unavailable error
export function isServiceUnavailableError(error: unknown): error is ApiErrorType {
	return isApiError(error) && error.name === "ServiceUnavailableError";
}

/**
 * Central API error handling mechanism
 * @param error - Error to handle
 * @returns NextResponse with appropriate status and message
 */
export function handleApiError(error: unknown): NextResponse {
	// Log errors differently based on environment
	if (process.env.NODE_ENV === "production") {
		// In production, log minimal information to avoid exposing sensitive data
		const errorName = isApiError(error)
			? error.name
			: error instanceof Error
				? error.name
				: "UnknownError";
		console.error("API Error:", errorName);
	} else {
		// In development, log more details
		console.error("API Error:", error);
	}

	// Handle API errors
	if (isApiError(error)) {
		const headers = new Headers();

		// Add headers for Method Not Allowed
		if (isMethodNotAllowedError(error)) {
			headers.set("Allow", error.allowedMethods.join(", "));
		}

		// Add Retry-After header for ServiceUnavailable
		if (isServiceUnavailableError(error)) {
			headers.set("Retry-After", "30");
		}

		return NextResponse.json({ error: error.message }, { status: error.status, headers });
	}

	// Handle database errors
	if (error instanceof Error) {
		const errorMessage = error.message.toLowerCase();

		if (
			errorMessage.includes("database connection") ||
			errorMessage.includes("database timeout") ||
			errorMessage.includes("connection failed")
		) {
			return NextResponse.json(
				{ error: labels.errors.somethingWentWrong },
				{
					status: 503,
					headers: { "Retry-After": "30" },
				},
			);
		}
	}

	// Default error handling
	return NextResponse.json({ error: labels.errors.somethingWentWrong }, { status: 500 });
}

/**
 * Helper function for handling disallowed HTTP methods
 * @param allowedMethods - List of allowed HTTP methods
 * @returns NextResponse with 405 code and appropriate headers
 */
export function methodNotAllowed(allowedMethods: string[] = ["GET"]): NextResponse {
	const headers = new Headers();
	headers.set("Allow", allowedMethods.join(", "));

	return NextResponse.json(
		{ error: labels.errors.unauthorized },
		{
			status: 405,
			headers,
		},
	);
}
