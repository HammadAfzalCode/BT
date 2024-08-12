const fileClaimSchema = {
	headers: {
		type: "object",
		properties: {
			authorization: { type: "string" },
		},
		required: ["authorization"],
	},
	body: {
		type: "object",
		properties: {
			order_id: {
				type: "string",
				format: "uuid",
			},
			product_id: {
				type: "string",
				format: "uuid",
			},
			quantity: { type: "number" },
			message: { type: "string" },
			claim_type: {
				type: "string",
				enum: ["missing", "defected"], // Restrict values to "missing" and "defected"
			},
			claim_image_ids: {
				type: "array",
				items: {
					type: "string",
				},
				maxItems: 5,
			},
		},
		required: ["order_id", "product_id", "message", "claim_type"],
		if: {
			properties: {
				claim_type: { const: "missing" },
			},
		},
		then: {
			required: ["quantity"],
		},
		if: {
			properties: {
				claim_type: { const: "defected" },
			},
		},
		then: {
			required: ["claim_image_ids"],
		},
	},
};

const claimImageUploadSchema = {
	headers: {
		type: "object",
		properties: {
			authorization: { type: "string" },
		},
		required: ["authorization"],
	},
	consumes: ['multipart/form-data'],
};

module.exports = {
	fileClaimSchema,
	claimImageUploadSchema,
};
