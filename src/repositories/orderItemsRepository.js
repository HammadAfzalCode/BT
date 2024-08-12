const Boom = require("@hapi/boom");
const { logger } = require("../../logger");
const {dataSource} = require("../../infrastructure/postgres");

const createOrderItem = async (payloadData) => {
    const orderItemsRepo = dataSource.getRepository("OrderDetail");
    const payload = {
        ...payloadData,
        created_at: new Date(),
        updated_at: new Date(),
    };
    const createOrderItem = orderItemsRepo.create(payload);
    const data = await orderItemsRepo.save(createOrderItem);
    return data;
};

const findAll = async () => {
    const orderItemsRepo = dataSource.getRepository("OrderDetail");
    const data = await orderItemsRepo.find();
    return data;
};



const findOne = async (filter) => {
    const orderItemsRepo = dataSource.getRepository("OrderDetail");
    const data = await orderItemsRepo.findOne(filter);
    return data;
};

const updateOrderItem = async (filter, payload) => {
    const orderItemsRepo = dataSource.getRepository("OrderDetail");
    const existingOrder = await orderItemsRepo.findOne({ where: filter });
    if (existingOrder) {
        let updatedPayload = {
            ...payload,
            updated_at: new Date(),
        };
        let update = orderItemsRepo.merge(existingOrder, updatedPayload);
        let data = await orderItemsRepo.save(update);
        return data;
    } else {
        throw Boom.notFound("Product doesn't exist");
    }
};

const remove = async (id) => {
    const orderItemsRepo = dataSource.getRepository("OrderDetail");
    const existingProduct = await orderItemsRepo.findOne({ where: { id } });
    if (existingProduct) {
        await orderItemsRepo.delete({ where: { id } });
        return "Product deleted successfully";
    } else {
        throw Boom.notFound("Product doesn't exist");
    }
};

const getOrderItems = async (filter) => {
    const orderItemsRepo = dataSource.getRepository("OrderDetail");
    const data = await orderItemsRepo.find({where: filter});
    return data;
};

const bulkInsertOrderItems = async (orderItems) => {
    const orderItemsRepository = dataSource.getRepository("OrderDetail");
    const createOrderItems = orderItemsRepository.create(orderItems);
    const data = await orderItemsRepository.save(createOrderItems);
    return data;
};

module.exports = {
    createOrderItem,
    findAll,
    findOne,
    updateOrderItem,
    remove,
    getOrderItems,
    bulkInsertOrderItems,
};
