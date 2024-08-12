const createOrderBody = {
	body: {
		type: "object",
		properties: {
			store_id: { type: "number"},
		},
	},
};

const getMyOrderSchema = {
	querystring: {
		type: "object",
		properties: {
			page: { type: "number" },
			pageSize: { type: "number" },
			status: { 
				type: "string",
				enum: ["requests", "ongoing", "picked", "packed", "process", "in-transit", "in-process", "claimed", "completed"]
			}
		},
	},
	headers: {
		type: "object",
		properties: {
			authorization: { type: "string" },
		},
		required: ["authorization"],
	},
};

const getOrderDetailSchema = {
	params: {
		type: "object",
		properties: {
			order_id: { type: "string" }
		},
		required: ["order_id"]
	},
	headers: {
		type: "object",
		properties: {
			authorization: { type: "string" }
		},
		required: ["authorization"]
	}
};

const updateOrderStatusSchema = {
	body: {
		type: "object",
		properties: {
			order_id: { type: "string" },
			status: { 
				type: "string",
				enum: ["accepted", "picked", "packed", "in-transit", "canceled", "completed", "claimed"], 
			},
			products: {
				type: "array",
				items: {
					type: "object",
					properties: {
						product_id: { type: "string" },
						shipped_quantity: { type: "number" }
					},
				}
			}
		},
		required: ["order_id", "status"],
		if: {
			properties: {
				status: { const: "packed" }
			}
		},
		then: {
			required: ["products"]
		}
	},
	headers: {
		type: "object",
		properties: {
			authorization: { type: "string" }
		},
		required: ["authorization"]
	}
};

const placeOrderSchema = {
	headers: {
		type: "object",
		properties: {
			authorization: { type: "string" }
		},
		required: ["authorization"]
	}
}

const reOrderSchema = {
	headers: {
		type: "object",
		properties: {
			authorization: { type: "string" }
		},
		required: ["authorization"]
	},
	body: {
		type: "object",
		properties: {
			order_id: { type: "string" }
		},
		required: ['order_id']
	}
}

module.exports = {
	createOrderBody,
	getMyOrderSchema,
	updateOrderStatusSchema,
	getOrderDetailSchema,
	placeOrderSchema,
	reOrderSchema,
};
