const { createStore, getAllStores, getOneStore, updateStore, deleteStore } = require("../../controllers/storeController");
const { userAuthentication } = require("../../middlewares/authMiddleware");
const bodySchema = require("../../schemas/storeSchema");

module.exports = async (fastify, options) => {
    fastify.route({
		method: "POST",
		url: "/create-store",
		schema: bodySchema.createStoreBody,
		preHandler: userAuthentication,
		handler: createStore,
	});
    fastify.route({
		method: "GET",
		url: "/get-all-stores",
		preHandler: userAuthentication,
		handler: getAllStores,
	});
    fastify.route({
		method: "GET",
		url: "/get-store/:id",
		preHandler: userAuthentication,
		handler: getOneStore,
	});
    fastify.route({
		method: "PUT",
		url: "/update-store/:id",
		preHandler: userAuthentication,
		handler: updateStore,
	});
    fastify.route({
		method: "DELETE",
		url: "/delete-store/:id",
		preHandler: userAuthentication,
		handler: deleteStore,
	});
};