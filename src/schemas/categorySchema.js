const Joi = require("joi");

const categoryCreateSchema = Joi.object({
	name: Joi.string().required(),
	image_url: Joi.string().required(),
})
	.required()
	.options({ allowUnknown: false });

const categoryBodySchema = {
	body: {
		type: "object",
		properties: {
			name: { type: "string" },
			image_url: { type: "string" },
		},
		required: ["name", "image_url" ],
	},
};

const getCategoriesSchema = {
	querystring: {
		type: "object",
		properties: {
			page: { type: "string" },
			pageSIze: { type: "string" },
		},
		required: ["page", "pageSize" ],
	},
};

module.exports = {
	categoryCreateSchema,
	categoryBodySchema,
	getCategoriesSchema,
};
