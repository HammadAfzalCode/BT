const {
  getDashboarcInventorySchema,
  createInventorySchema,
} = require("../../schemas/inventorySchema");
const {
  getDashboardDetails,
  getWarehouseInventory,
  getShortExpiryProducts,
  getAllWarehouseInventory,
  getAllWarehouseInventoryCount,
} = require("../../controllers/inventoryController");
const { userAuthentication } = require("../../middlewares/authMiddleware");

module.exports = async (fastify, options) => {
  fastify.route({
    method: "POST",
    url: "/create-inventory",
    schema: createInventorySchema,
    preHandler: userAuthentication,
    handler: getDashboardDetails,
  });

  fastify.route({
    method: "GET",
    url: "/get-dashboard-details",
    schema: getDashboarcInventorySchema,
    preHandler: userAuthentication,
    handler: getDashboardDetails,
  });

  fastify.route({
    method: "GET",
    url: "/get-warehouse-inventory",
    preHandler: userAuthentication,
    handler: getWarehouseInventory,
  });

  fastify.route({
    method: "GET",
    url: "/get-all-warehouse-inventory",
    preHandler: userAuthentication,
    handler: getAllWarehouseInventory,
  });

  fastify.route({
    method: "GET",
    url: "/get-all-warehouse-inventory-count",
    preHandler: userAuthentication,
    handler: getAllWarehouseInventoryCount,
  });

  fastify.route({
    method: "GET",
    url: "/get-short-expiry-items",
    preHandler: userAuthentication,
    handler: getShortExpiryProducts,
  });
};
