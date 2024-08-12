const Boom = require("@hapi/boom");
const { fileClaimService, uploadService, warehouseClaimsService } = require("../services/claimsService");

const fileClaimController = async (request, response) => {
	try {
		const { user_id } = request.user;
		const { order_id, product_id, message, claim_type, quantity, claim_image_ids } = request.body;
		const result = await fileClaimService(user_id, order_id, product_id, message, claim_type, quantity, claim_image_ids);
		response.code(200).send({
			status: true,
			message: "success",
			data: result ?? null,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const uploadController = async (request, response) => {
	try {
		const file = await request.file({ limits: { fileSize: (10 * 1024 * 1024) } }); // (2 * 1024 * 1024) = 2MB
		const result = await uploadService(file);
		response.code(200).send({
			status: true,
			message: "success",
			data: result ?? null,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const getWarehouseClaims = async (request, response) => {
	try {
		const { workplace_id, workplace_type } = request.user;
		const { status } = request.query;
		if (!status) throw Error("please provide status in parameter");
		const result = await warehouseClaimsService(workplace_id, workplace_type, status);
		response.code(200).send({
			status: true,
			message: "success",
			data: result ?? null,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};



module.exports = {
	fileClaimController,
	uploadController,
	getWarehouseClaims,
};
