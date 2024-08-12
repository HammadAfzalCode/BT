const Boom = require("@hapi/boom");
const { dataSource } = require("../../infrastructure/postgres");

const create = async (cartObject, options={}) => {
    const { queryRunner } = options;
    const cartRepository = queryRunner ? queryRunner.manager.getRepository("Cart") : dataSource.getRepository("Cart");
    const carts = cartRepository.create(cartObject);
    const save = await cartRepository.save(carts);
    return save;
};

const findAll = async () => {
    const cartRepository = dataSource.getRepository("Cart");
    const getCarts = await cartRepository.find();
    return getCarts;
};

const findOne = async (filter) => {
    const cartRepository = dataSource.getRepository("Cart");
    const getCart = await cartRepository.findOne({
        where: filter,
        relations: ["cartItems", "user"],
    });
    return getCart;
}

const update = async (filter, payload) => {
    const cartRepository = dataSource.getRepository("Cart");
    const existingCart = await cartRepository.findOne({ where: filter});
    if (existingCart) {
        let updatedPayload = {
            ...payload,
            updated_at: new Date(),
        };
        let update = cartRepository.merge(existingCart, updatedPayload);
        let save = await cartRepository.save(update);
        return save;
    } else {
        throw Boom.notFound('Cart not found');
    }
};

const remove = async (filter) => {
    const cartRepository = dataSource.getRepository("Cart");
    const existingCart = await cartRepository.findOne({ where: filter });
    if (existingCart) {
        await cartRepository.delete(existingCart.id);
        return `${existingCart.id} Cart has been deleted `;
    } else {
        throw Boom.notFound('Cart does not exist');
    }
};

const getUserCartRepository = async (filter) => {
    const cartRepository = dataSource.getRepository("Cart");
    const getCart = await cartRepository.findOne({
        where: filter,
    });
    return getCart;
}

const findMyCartRepo = async (filter) => {
	const cartRepository = dataSource.getRepository("Cart");
	const getCart = await cartRepository
		.createQueryBuilder("cart")
		.leftJoinAndSelect("cart.cartItems", "cartItem")
		.leftJoinAndSelect("cartItem.product", "product")
		.select([
			"cart.id",
			"cart.user_id",
			"cart.store_id",
			"cart.discount_percentage",
			"cart.shipping_cost",
			"cartItem.id",
			"cartItem.quantity",
			"product.id",
			"product.title",
			"product.thumbnail_image_url",
			"product.selling_price",
			"product.pack_of",
		])
		.where(filter)
		.getOne();
	return getCart;
};

module.exports = {
	create,
	findAll,
	findOne,
	update,
	remove,
	getUserCartRepository,
	findMyCartRepo,
};
