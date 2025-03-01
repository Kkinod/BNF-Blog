module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
	transform: {
		"^.+\\.(ts|tsx)$": ["babel-jest", { configFile: "./babel.config.test.js" }],
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	transformIgnorePatterns: ["/node_modules/(?!(@testing-library)/)"],
};
