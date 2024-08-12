const cartService = require("../services/cartService");

const createCart = async (request, response) => {
	try {
		const { user_id, store_id } = request.body
		const carts = await cartService.createCart({ user_id, store_id });
		response.code(200).send({
			status: true,
			message: "Create Cart successfully",
			data: carts,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const getAllCart = async (request, response) => {
	try {
		const carts = await cartService.getAllCart();
		response.code(200).send({
			status: true,
			message: "Success",
			data: carts,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const getSingleCart = async (request, response) => {
	try {
		const { user_id } = request.user;
		const cart = await cartService.getCartByFilter("user_id", user_id);
		response.code(200).send({
			status: true,
			message: "Success",
			data: cart ? cart : "cart not found",
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const updateCart = async (request, response) => {
	try {
		const { id } = request.params;
		const body = request.body;
		const cart = await cartService.updateCart(id, body);
		response.code(200).send({
			status: true,
			message: "Cart updated",
			data: cart,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const deleteCart = async (request, response) => {
	try {
		const { id } = request.params;
		const cart = await cartService.deleteCart(id);
		response.code(200).send({
			status: true,
			message: "Cart has been deleted",
			data: cart,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

module.exports = {
	createCart,
	getAllCart,
	getSingleCart,
	updateCart,
	deleteCart,
};
