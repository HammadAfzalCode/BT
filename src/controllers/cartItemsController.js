const cartItemsService = require("../services/cartItemsService");

const addToCartController = async (request, response) => {
	try {
		const { user_id } = request.user
		const { product_id, quantity } = request.body
		const itemAddedToCart = await cartItemsService.addToCartService(user_id, product_id, quantity);
		response.code(200).send({
			status: true,
			message: "Product Added Cart",
			data: itemAddedToCart,
		});

	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
}

const createCartItems = async (request, response) => {
	try {
		const cartItems = await cartItemsService.createCartItems(request.body);
		response.code(200).send({
			status: true,
			message: "CartItems Created",
			data: cartItems,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const getAllCartItems = async (request, response) => {
	try {
		const cartsItems = await cartItemsService.getAllCartItems();
		response.code(200).send({
			status: true,
			message: "Success",
			data: cartsItems,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const getSingleCartItems = async (request, response) => {
	try {
		const { id } = request.params;
		const cartItems = await cartItemsService.getSingleCartItems(id);
		response.code(200).send({
			status: true,
			message: "success",
			data: cartItems,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const updateCartItems = async (request, response) => {
	try {
		const { id } = request.params;
		const body = request.body;
		const cartItems = await cartItemsService.updateCartItems(id, body);
		response.code(200).send({
			status: true,
			message: "CartItems updated",
			data: cartItems,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const deleteCartItems = async (request, response) => {
	try {
		const { id } = request.params;
		const cartItems = await cartItemsService.deleteCartItems(id);
		response.code(200).send({
			status: true,
			message: "CartItem has been deleted",
			data: cartItems,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};
module.exports = {
	createCartItems,
	getSingleCartItems,
	getAllCartItems,
	updateCartItems,
	deleteCartItems,
	addToCartController,
};
