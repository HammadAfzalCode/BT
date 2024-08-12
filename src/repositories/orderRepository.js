const Boom = require("@hapi/boom");
const { logger } = require("../../logger");
const { dataSource } = require("../../infrastructure/postgres");

const create = async (payloadData) => {
    const orderRepo = dataSource.getRepository("Order");
    let payload = {
        ...payloadData,
        created_at: new Date(),
        updated_at: new Date(),
    };
    const createOrder = orderRepo.create(payload);
    const data = await orderRepo.save(createOrder);
    return data;
};

const findAll = async (page = 1, pageSize = 10) => {
    const orderRepo = dataSource.getRepository("Order");
    const [data, totalCount] = await orderRepo.findAndCount({
        skip: page,
        take: pageSize,
        relations: ["orderDetails", "store"],
    });
    return {
        data,
        totalCount
    };
};

const findMyOrders = async (offset = 1, limit = 10, filter) => {
    const orderRepo = dataSource.getRepository("Order");
    const [data, totalCount] = await orderRepo.findAndCount({
        skip: offset,
        take: limit,
        where: filter,
        relations: ["orderDetails", "warehouse", "user"],
    });

    return {
        data,
        totalCount
    }
};

const findOne = async (filter) => {
    const orderRepo = dataSource.getRepository("Order");
    const data = await orderRepo.findOne({ 
        where: filter,
        relations: ["orderDetails.product"]
    });
    return data;
};

const update = async (filter, payload) => {
    const orderRepo = dataSource.getRepository("Order");
    const existingOrder = await orderRepo.findOne({ where: filter });
    if (existingOrder) {
        const updatedPayload = {
            ...payload,
            updated_at: new Date(),
        };
        const update = orderRepo.merge(existingOrder, updatedPayload);
        const data = await orderRepo.save(update);
        return data;
    } else {
        throw Boom.notFound("Product doesn't exist");
    }
};

const remove = async (filter) => {
    const orderRepo = dataSource.getRepository("Order");
    const existingProduct = await orderRepo.findOne({ where: filter });
    if (existingProduct) {
        await orderRepo.delete({ where: filter });
        return "Product deleted successfully";
    } else {
        throw Boom.notFound("Product doesn't exist");
    }
};


const findOrdersByFilter = async (offset = 1, limit = 10, filter) => {
	const orderRepo = dataSource.getRepository("Order");

	const [data, totalCount] = await orderRepo
		.createQueryBuilder("order")
		.leftJoinAndSelect("order.user", "user")
		.leftJoinAndSelect("order.warehouse", "warehouse")
		.leftJoinAndSelect("order.store", "store")
		.leftJoinAndSelect("order.orderDetails", "orderDetail")
		.leftJoinAndSelect("orderDetail.product", "orderDetailProduct")
		.where(filter)
		.select([
			"order.id",
			"order.order_status",
			"order.discount_percentage",
			"order.shipping_cost",
			"order.created_at",
			"user.id",
			"user.first_name",
			"user.last_name",
			"user.email",
			"warehouse.id",
			"warehouse.name",
			"warehouse.location",
			"store.id",
			"store.name",
			"store.location",
			"orderDetail.id",
			"orderDetail.ordered_quantity",
			"orderDetail.shipped_quantity",
			"orderDetailProduct.id",
			"orderDetailProduct.title",
			"orderDetailProduct.unit_price",
			"orderDetailProduct.selling_price",
			"orderDetailProduct.thumbnail_image_url",
		])
		.take(limit)
		.skip(offset)
		.getManyAndCount();

	return {
        data,
        totalCount
    };
};

module.exports = {
    create,
    findAll,
    findMyOrders,
    findOne,
    update,
    remove,
	findOrdersByFilter,
};
