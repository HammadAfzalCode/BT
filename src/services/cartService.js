const Boom = require("@hapi/boom");
const _ = require("lodash")
const { create, findAll, findOne, update, remove, findMyCartRepo } = require("../repositories/cartRepository");
const { totalCalculator, moneyValueAddition } = require("../utils/priceFormatter");
const config = require("../globals/config")

const createCart = async (cartInfo) => {
	const { user_id, store_id } = cartInfo;
	const isCartExist = await findOne({ user_id });
	const shipping_cost = config.get("constants").shipping_cost;
	if (isCartExist) {
        throw Boom.conflict(`user id ${user_id}'s store cart already exist!`)
	}
	return await create({ user_id, store_id, shipping_cost: shipping_cost });
};

const getAllCart = async () => {
	return await findAll();
};

const getCartByFilter = async (filterBy, filterValue) => {
	const filter = {
		[filterBy]: filterValue
	};
	const cartDetails = await findMyCartRepo(filter);
	if(_.isUndefined(cartDetails)) throw Boom.badData("Cart does not exists");

	let totalAmount = "$0";
	for (let i = 0; i < cartDetails.cartItems.length; i++) {
		const cartItem = cartDetails.cartItems[i];
		cartItem.total_price = totalCalculator(cartItem.product.selling_price, cartItem.quantity);
		totalAmount = moneyValueAddition(totalAmount, cartItem.total_price);
		cartDetails['total_amount'] = totalAmount
	}
	cartDetails['grand_total'] = moneyValueAddition(totalAmount, cartDetails.shipping_cost)
	return cartDetails;
};

const updateCart = async (id, payload) => {
	return await update({id}, payload);
};

const deleteCart = async (id) => {
	return await remove({id});
};

module.exports = {
	createCart,
	getAllCart,
	getCartByFilter,
	updateCart,
	deleteCart,
};
