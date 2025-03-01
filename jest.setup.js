// Import rozszerzeń dla React Testing Library
require("@testing-library/jest-dom");

beforeAll(() => {
	jest.spyOn(console, "error").mockImplementation(() => {});
	jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
	console.error.mockRestore();
	console.warn.mockRestore();
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
