const Github = jest.fn().mockImplementation((options) => ({
	id: "github",
	name: "GitHub",
	type: "oauth",
	clientId: options?.clientId || "mock-github-client-id",
	clientSecret: options?.clientSecret || "mock-github-client-secret",
}));

module.exports = Github;
