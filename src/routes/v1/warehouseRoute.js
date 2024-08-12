const { createWarehouseCont, getAllWarehousesCont, getOneWarehouseCont, updateWarehouseCont, deleteWarehouseCont } = require("../../controllers/warehouseController");
const { userAuthentication } = require("../../middlewares/authMiddleware");
const { createStoreBody } = require("../../schemas/storeSchema");

module.exports = async (fastify, options) => {
    fastify.route({
		method: "POST",
		url: "/create-warehouse",
		schema: createStoreBody,
		preHandler: userAuthentication,
		handler: createWarehouseCont,
	});
    fastify.route({
		method: "GET",
		url: "/get-all-warehouses",
		preHandler: userAuthentication,
		handler: getAllWarehousesCont,
	});
    fastify.route({
		method: "GET",
		url: "/get-warehouse/:id",
		preHandler: userAuthentication,
		handler: getOneWarehouseCont,
	});
    fastify.route({
		method: "PUT",
		url: "/update-warehouse/:id",
		preHandler: userAuthentication,
		handler: updateWarehouseCont,
	});
    fastify.route({
		method: "DELETE",
		url: "/delete-warehouse/:id",
		preHandler: userAuthentication,
		handler: deleteWarehouseCont,
	});
};