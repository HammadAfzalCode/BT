const { createOrder, getAllOrders, getMyStoreOrders, getOneOrder, updateOrder, deleteOrder, getOrderStatusDetails, getWarehouseOrders, placeOrderController, reOrderController } = require("../../controllers/orderController");
const { userAuthentication } = require("../../middlewares/authMiddleware");
const { createOrderBody, getMyOrderSchema, updateOrderStatusSchema, getOrderDetailSchema, placeOrderSchema, reOrderSchema } = require("../../schemas/orderSchema");

module.exports = async (fastify, options) => {

    fastify.route({
        method: "POST",
        url: "/create-order",
        schema: createOrderBody,
        preHandler: userAuthentication,
        handler: createOrder,
    });
    
	// fastify.route({
	// 	method: "GET",
	// 	url: "/get-all-orders",
	// 	preHandler: userAuthentication,
	// 	handler: getAllOrders,
	// });

	fastify.route({
		method: "GET",
		url: "/store-orders",
		schema: getMyOrderSchema,
		preHandler: userAuthentication,
		handler: getMyStoreOrders,
	});

	// fastify.route({
	// 	method: "GET",
	// 	url: "/get-order-details/:order_id",
	// 	preHandler: userAuthentication,
	// 	handler: getOneOrder,
	// });

	fastify.route({
		method: "GET",
		url: "/order-status-details/:order_id",
		schema: getOrderDetailSchema,
		preHandler: userAuthentication,
		handler: getOrderStatusDetails,
	});

	fastify.route({
		method: "PUT",
		url: "/update-order",
		schema: updateOrderStatusSchema,
		preHandler: userAuthentication,
		handler: updateOrder,
	});

	fastify.route({
		method: "DELETE",
		url: "/delete-order/:id",
		preHandler: userAuthentication,
		handler: deleteOrder,
	});

	fastify.route({
		method: "GET",
		url: "/warehouse-orders",
		schema: getMyOrderSchema,
		preHandler: userAuthentication,
		handler: getWarehouseOrders,
	});

	fastify.route({
		method: "POST",
		url: "/place-order",
		schema:  placeOrderSchema,
		preHandler: userAuthentication,
		handler: placeOrderController,
	})

	fastify.route({
		method: "POST",
		url: "/re-order",
		schema: reOrderSchema,
		preHandler: userAuthentication,
		handler: reOrderController,
	});
};
