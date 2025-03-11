require("@testing-library/jest-dom");

const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock("next/font/google", () => ({
	Poppins: () => ({
		className: "mocked-poppins-classname",
		style: { fontFamily: "Poppins" },
	}),
}));

jest.mock("resend", () => ({
	Resend: jest.fn().mockImplementation(() => ({
		emails: {
			send: jest.fn().mockResolvedValue({ id: "mock-email-id" }),
		},
	})),
}));

let consoleErrorSpy;
let consoleWarnSpy;

beforeAll(() => {
	consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
	consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
	consoleErrorSpy.mockRestore();
	consoleWarnSpy.mockRestore();
});

expect.extend({
	// Sample custom matcher
	toBeWithinRange(received, floor, ceiling) {
		const pass = received >= floor && received <= ceiling;
		if (pass) {
			return {
				message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
				pass: true,
			};
		} else {
			return {
				message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
				pass: false,
			};
		}
	},
});
