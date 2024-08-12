const Joi = require("joi");
const { createCartItems, getAllCartItems, getSingleCartItems, updateCartItems, deleteCartItems, addToCartController } = require("../../controllers/cartItemsController");
const { userAuthentication } = require("../../middlewares/authMiddleware");
const { addToCartSchema } = require('../../schemas/cartSchema');

module.exports = async (fastify, options) => {

	fastify.route({
		method: "POST",
		url: "/update-cart",
		schema: addToCartSchema,
		preHandler: userAuthentication,
		handler: addToCartController,
	});
	
	// fastify.route({
	// 	method: "POST",
	// 	url: "/create-cart-items",
	// 	handler: createCartItems,
	// });

	// fastify.route({
	// 	method: "GET",
	// 	url: "/get-all-cart-items",
	// 	handler: getAllCartItems,
	// });
	// fastify.route({
	// 	method: "GET",
	// 	url: "/get-one-cart-item/:id",
	// 	handler: getSingleCartItems,
	// });
	// fastify.route({
	// 	method: "PUT",
	// 	url: "/update-cart-item/:id",
	// 	handler: updateCartItems,
	// });
	// fastify.route({
	// 	method: "DELETE",
	// 	url: "/delete-cart-item/:id",
	// 	handler: deleteCartItems,
	// });
};
