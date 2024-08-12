const { fileClaimSchema, claimImageUploadSchema } = require("../../schemas/claimsSchema");
const { userAuthentication } = require("../../middlewares/authMiddleware");
const {
	fileClaimController,
	uploadController,
	getWarehouseClaims,
} = require("../../controllers/claimsController");

module.exports = async (fastify, opts) => {

    fastify.route({
        method: 'POST',
        url: '/file-claim',
        schema: fileClaimSchema,
        preHandler: userAuthentication,
        handler: fileClaimController
    });
    
    fastify.route({
		method: "POST",
		url: "/upload",
		schema: claimImageUploadSchema,
		preHandler: userAuthentication,
		handler: uploadController,
	});

    fastify.route({
		method: "GET",
		url: "/get-warehouse-claims",
		preHandler: userAuthentication,
		handler: getWarehouseClaims,
	});
};
