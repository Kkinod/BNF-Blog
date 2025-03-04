const Google = jest.fn().mockImplementation((options) => ({
	id: "google",
	name: "Google",
	type: "oauth",
	clientId: options?.clientId || "mock-google-client-id",
	clientSecret: options?.clientSecret || "mock-google-client-secret",
}));

module.exports = Google;
