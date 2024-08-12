const Boom = require("@hapi/boom");
const {dataSource} = require("../../infrastructure/postgres");

const create = async (backOfficeData) => {
    const backOfficeRepository = dataSource.getRepository("Warehouse");
    const payload = {
        ...backOfficeDataData,
        created_at: new Date(),
        updated_at: new Date(),
    };
    const createWarehouse = warehouseRepository.create(payload);
    const data = await warehouseRepository.save(createWarehouse);
    return data;
};