const Joi = require("joi");

const productCreateSchema = Joi.object({
	title: Joi.string().required(),
	description: Joi.string().required(),
	unit_price: Joi.number().required(),
	selling_price: Joi.number().required(),
	image_url: Joi.string().required(),
	barcode: Joi.string().required(),
	category_id: Joi.number().required(),
	sub_category_id: Joi.number(),
	created_by: Joi.number().required(),
	updated_by: Joi.number().required(),
})
	.required()
	.options({ allowUnknown: false });

const productBodySchema = {
	body: {
		type: "object",
		properties: {
			title: { type: "string" },
			description: { type: "string" },
			unit_price: { type: "number" },
			selling_price: { type: "number" },
			image_url: { type: "string" },
			barcode: { type: "string" },
			category_id: { type: "number" },
			sub_category_id: { type: "number" },
			created_by: { type: "number" },
			updated_by: { type: "number" },
		},
		required: ["title", "description", "unit_price", "selling_price", "image_url", "barcode", "category_id", "created_by", "updated_by"],
	},
};

const getProductListSchema = {
	querystring: {
		type: "object",
		properties: {
			category_id: { type: "string" },
		},
	},
	headers : {
		type: "object",
		properties: {
			authorization: { type: "string" },
		},
		required: ["authorization"],
	}
}

const getSingleProduct = {
	querystring: {
		type: "object",
		properties: {
			filterBy: { type: "string" },
			filterValue: { type: "string" }
		},
		required: ["filterBy", "filterValue"]
	},
	headers: {
		type: "object",
		properties: {
			authorization: { type: "string" }
		},
		required: ["authorization"]
	}
}

const getProductTitleList = {
	headers: {
		type: "object",
		properties: {
			authorization: { type: "string" }
		},
		required: ["authorization"]
	}
}

module.exports = {
	productBodySchema,
	productCreateSchema,
	getProductListSchema,
	getSingleProduct,
	getProductTitleList,
};
