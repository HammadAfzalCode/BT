const Boom = require("@hapi/boom");
const { dataSource } = require("../../infrastructure/postgres");

const create = async (cartItemsInfo) => {
	const cartItemsRepo = dataSource.getRepository("CartItems");
	const cartsItems = cartItemsRepo.create(cartItemsInfo);
	await cartItemsRepo.save(cartsItems);
	return cartsItems;
};

const findAll = async () => {
	const cartItemsRepo = dataSource.getRepository("CartItems");
	const getCartsItems = await cartItemsRepo.find();
	return getCartsItems;
};

const findOne = async (filter) => {
	const cartItemsRepo = dataSource.getRepository("CartItems");
	const getCartItems = cartItemsRepo.findOne({ where: filter });
	return getCartItems;
};

const update = async (filter, payload) => {
	const cartItemsRepo = dataSource.getRepository("CartItems");
	const existingCartItems = await cartItemsRepo.findOne({ where: filter });
	if (existingCartItems) {
		const updatedPayload = {
			...payload,
			updated_at: new Date(),
		};
		const update = cartItemsRepo.merge(existingCartItems, updatedPayload);
		const save = await cartItemsRepo.save(update);
		return save;
	} else {
		throw Boom.notFound('CartItems does not found');
	}
};

const remove = async (filter) => {
	const cartItemsRepo = dataSource.getRepository("CartItems");
	const existingCartItems = await cartItemsRepo.findOne({ where: filter });
	if (existingCartItems) {
		await cartItemsRepo.delete({ where: filter });
		return 'CartItem has been deleted';
	} else {
		throw Boom.notFound('CartItem id does not exist');
	}
};

const addToCartRepo = async (cartId, productID, quantity) => {
	const cartItemsRepo = dataSource.getRepository("CartItems");
	const cartsItems = cartItemsRepo.create({ cart_id: cartId, product_id: productID, quantity: quantity });
	await cartItemsRepo.save(cartsItems);
	return cartsItems;
};

const getCartItemRepository = async (filter) => {
	const cartItemsRepo = dataSource.getRepository("CartItems");
	const getCartItems = cartItemsRepo.find({ where: filter });
	return getCartItems;
};

const deleteCartItemRepository = async (filter) => {
	const cartItemsRepo = dataSource.getRepository("CartItems");
	await cartItemsRepo.delete(filter);
};

module.exports = {
	create,
	findAll,
	findOne,
	update,
	remove,
	addToCartRepo,
	getCartItemRepository,
	deleteCartItemRepository,
};
