const Boom = require("@hapi/boom");
const {dataSource} = require("../../infrastructure/postgres");

const create = async (warehouseData) => {
    const warehouseRepository = dataSource.getRepository("Warehouse");
    const payload = {
        ...warehouseData,
        created_at: new Date(),
        updated_at: new Date(),
    };
    const createWarehouse = warehouseRepository.create(payload);
    const data = await warehouseRepository.save(createWarehouse);
    return data;
};

const findAll = async (offset, limit) => {
    const warehouseRepository = dataSource.getRepository("Warehouse");
    const [data, totalCount] = await warehouseRepository.findAndCount({
        skip: offset,
        take: limit,
    });
    return {
        data,
        totalCount
    };
};

const findOne = async (filter) => {
    const warehouseRepository = dataSource.getRepository("Warehouse");
    const data = await warehouseRepository.findOne({where: filter});
    return data;
};

const update = async (filter, payload) => {
    const warehouseRepository = dataSource.getRepository("Warehouse");
    const existingWarehouse = await warehouseRepository.findOne({ where: filter });
    if (existingWarehouse) {
        const updatedPayload = {
            ...payload,
            updated_at: new Date(),
        };
        const update = warehouseRepository.merge(existingWarehouse, updatedPayload);
        const data = await warehouseRepository.save(update);
        return data;
    } else {
        throw Boom.notFound("Warehouse doesn't exist");
    }
};

const remove = async (filter) => {
    const warehouseRepository = dataSource.getRepository("Warehouse");
    const existingWarehouse = await findOne(filter);
    if (existingWarehouse) {
        await warehouseRepository.delete(filter);
        return "Warehouse deleted successfully";
    } else {
        throw Boom.notFound("Warehouse doesn't exist");
    }
};

const getWarehouse = async (filter) => {
    const warehouseRepository = dataSource.getRepository("Warehouse");
    const data = await warehouseRepository.findOne({where: filter});
    return data;
};

module.exports = {
    create,
    findAll,
    findOne,
    update,
    remove,
    getWarehouse,
};
