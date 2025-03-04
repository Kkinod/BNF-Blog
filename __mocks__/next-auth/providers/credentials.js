const Credentials = jest.fn().mockImplementation((options) => ({
	id: "credentials",
	name: "Credentials",
	type: "credentials",
	credentials: options?.credentials || {},
	authorize: options?.authorize || jest.fn().mockResolvedValue(null),
}));

module.exports = Credentials;
