const createStoreBody = {
	body: {
		type: "object",
		properties: {
			name: { type: "string" },
			location: { type: "string" },
		},
	},
};

module.exports = {
	createStoreBody,
};
