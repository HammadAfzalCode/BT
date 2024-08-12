const Boom = require("@hapi/boom");
const { dataSource } = require("../../infrastructure/postgres");

const create = async (storeData) => {
    const storeRepository = dataSource.getRepository("Store");
    const payload = {
        ...storeData,
        created_at: new Date(),
        updated_at: new Date(),
    };
    const createOrder = storeRepository.create(payload);
    const data = await storeRepository.save(createOrder);
    return data;
};

const findAll = async (offset, limit) => {
    const storeRepository = dataSource.getRepository("Store");
    const [data, totalCount] = await storeRepository.findAndCount({
        skip: offset,
        take: limit,
    });
    return {
        data,
        totalCount
    };
};

const findOne = async (filter) => {
    const storeRepository = dataSource.getRepository("Store");
    const data = await storeRepository.findOne({where: filter});
    return data;
};

const update = async (filter, payload) => {
    const storeRepository = dataSource.getRepository("Store");
    const existingProduct = await storeRepository.findOne({ where: filter });
    if (existingProduct) {
        const updatedPayload = {
            ...payload,
            updated_at: new Date(),
        };
        const update = storeRepository.merge(existingProduct, updatedPayload);
        const data = await storeRepository.save(update);
        return data;
    } else {
        throw Boom.notFound("Product doesn't exist");
    }
};

const remove = async (filter) => {
    const storeRepository = dataSource.getRepository("Store");
    const existingProduct = await storeRepository.findOne({ where: filter });
    if (existingProduct) {
        await storeRepository.delete({ where: filter });
        return "Product deleted successfully";
    } else {
        throw Boom.notFound("Product doesn't exist");
    }
};

const getStore = async (filter) => {
    const storeRepository = dataSource.getRepository("Store");
    const data = await storeRepository.findOne({ where: filter });
    return data;
};

module.exports = {
    create,
    findAll,
    findOne,
    update,
    remove,
    getStore,
};
