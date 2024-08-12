const getSubCategoriesSchema = {
	querystring: {
		type: "object",
		properties: {
			page: { 
                type: "number",
                minimum: 1,
                maximum: 50
            },
			pageSize: { 
                type: "number",
                minimum: 1,
                maximum: 50
            },
            category_id: { type: "string" }
		},
		required: ["page", "pageSize", "category_id" ],
	},
    headers : {
		type: "object",
		properties: {
			authorization: { type: "string" },
		},
		required: ["authorization"],
	}
};

module.exports = {
	getSubCategoriesSchema,
};
