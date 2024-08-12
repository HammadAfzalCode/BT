const { createBackOfficeCont } = require("../../controllers/backOfficeController");
const { userAuthentication } = require("../../middlewares/authMiddleware");
const { createBackOfficeBody } = require("../../schemas/backOfficeSchema");

module.exports = async (fastify, options) => {
    fastify.route({
		method: "POST",
		url: "/create-backoffice",
		schema: createBackOfficeBody,
		preHandler: userAuthentication,
		handler: createBackOfficeCont,
	});
};