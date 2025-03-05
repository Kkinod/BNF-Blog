const PrismaAdapter = jest.fn().mockImplementation(() => ({
	createUser: jest.fn().mockResolvedValue({}),
	getUser: jest.fn().mockResolvedValue({}),
	getUserByEmail: jest.fn().mockResolvedValue({}),
	getUserByAccount: jest.fn().mockResolvedValue({}),
	updateUser: jest.fn().mockResolvedValue({}),
	deleteUser: jest.fn().mockResolvedValue({}),
	linkAccount: jest.fn().mockResolvedValue({}),
	unlinkAccount: jest.fn().mockResolvedValue({}),
	createSession: jest.fn().mockResolvedValue({}),
	getSessionAndUser: jest.fn().mockResolvedValue({}),
	updateSession: jest.fn().mockResolvedValue({}),
	deleteSession: jest.fn().mockResolvedValue({}),
	createVerificationToken: jest.fn().mockResolvedValue({}),
	useVerificationToken: jest.fn().mockResolvedValue({}),
}));

module.exports = {
	PrismaAdapter,
};
