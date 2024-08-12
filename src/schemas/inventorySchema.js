const createInventorySchema = {
	headers : {
		type: "object",
		properties: {
			authorization: { type: "string" },
		},
		required: ["authorization"],
	},
	body: {
	  type: "object",
	  properties: {
		image_url: { type: "string" },
		product_name: { type: "string" },
		category: { type: "string" },
		quantity: { type: "number" },
		units: { type: "number" },
		expiry_date: { type: "string", format: "date" },
		threshhold_value: { type: "number" },
		badge_number: { type: "number" },
		barcode_box: { type: "string" },
		barcode_piece: { type: "string" }
	  },
	  required: [
		"image_url",
		"product_name",
		"category",
		"quantity",
		"units",
		"expiry_date",
		"threshhold_value",
		"badge_number",
		"barcode_box",
		"barcode_piece",
	  ],
	},
  };

const getDashboarcInventorySchema = {
	headers : {
		type: "object",
		properties: {
			authorization: { type: "string" },
		},
		required: ["authorization"],
	}
};

module.exports = {
	createInventorySchema,
	getDashboarcInventorySchema,
};
