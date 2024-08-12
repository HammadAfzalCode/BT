const _ = require('lodash');
const { create, findAll, findOne, update, remove, addToCartRepo } = require("../repositories/cartItemsRepo");
const { getCartByFilter } = require("./cartService")

const addToCartService = async (user_id, product_id, quantity) => {
	
	const cart = await getCartByFilter('user_id', user_id);

	const porductExistsInCart = await findOne({
		cart_id: cart.id,
		product_id,
		is_deleted: false
	})

	if (!_.isNil(porductExistsInCart)) {
		const updatedCartItem = await update({
			cart_id: cart.id,
			product_id,
			is_deleted: false
		}, {
			quantity: quantity
		})
		return updatedCartItem
	}

	const productAdded = await addToCartRepo(cart.id, product_id, quantity);
	return productAdded;
}

const createCartItems = async (cartItemsInfo) => {
	return await create(cartItemsInfo);
};

const getAllCartItems = async () => {
	return await findAll();
};

const getSingleCartItems = async (id) => {
	return await findOne({id});
};

const updateCartItems = async (id, payload) => {
	const filter = { id }
	return await update(filter, payload);
};

const deleteCartItems = async (id) => {
	const filter = { id }
	return await remove(filter);
};

module.exports = {
	createCartItems,
	getAllCartItems,
	getSingleCartItems,
	updateCartItems,
	deleteCartItems,
	addToCartService,
};
