const userRoutes = require("./v1/userRoutes");
const testingRoutes = require("./v1/testingRoutes");
const testingRoutesV2 = require("./v2/testingRoutesV2");
const productRoutes = require("./v1/productRoute");
const orderRoutes = require("./v1/orderRoute");
const storeRoutes = require("./v1/storeRoutes");
const categoryRoutes = require("./v1/categoryRoutes");
const subCategoryRoutes = require("./v1/subCategoryRoutes");
const cartRoutes = require("./v1/cartRoutes");
const cartItemRoutes = require("./v1/cartItemsRoutes");
const warehouseRoutes = require("./v1/warehouseRoute");
const inventoryRoutes = require("./v1/inventoryRoutes");
const claimRoutes = require("./v1/claimsRoutes");

module.exports = (fastify) => {
	fastify.register(userRoutes, { prefix: "/v1" });
	fastify.register(testingRoutes, { prefix: "/v1" });
	fastify.register(testingRoutesV2, { prefix: "/v2" });
	fastify.register(productRoutes, { prefix: "/v1" });
	fastify.register(orderRoutes, { prefix: "/v1" });
	fastify.register(storeRoutes, { prefix: "/v1" });
	fastify.register(categoryRoutes, { prefix: "/v1" });
	fastify.register(subCategoryRoutes, { prefix: "/v1" });
	fastify.register(cartRoutes, { prefix: "/v1" });
	fastify.register(cartItemRoutes, { prefix: "/v1" });
	fastify.register(warehouseRoutes, { prefix: "/v1" });
	fastify.register(inventoryRoutes, { prefix: "/v1" });
	fastify.register(claimRoutes, { prefix: "/v1" })
};
