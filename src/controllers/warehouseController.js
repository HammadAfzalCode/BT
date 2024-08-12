const { logger } = require("../../logger");
const {createWarehouse, getAllWarehouses, getOneWarehouse, updateWarehouse, deleteWarehouse} = require("../services/warehouseService");

const createWarehouseCont = async (request, response) => {
    logger.info("data: ", request.body);
    try {
        const warehouse = await createWarehouse(request.body);
        response.code(200).send({
            status: true,
            message: "success",
            data: warehouse,
        });
    } catch (error) {
        response.code(400).send({
            status: false,
            message: error.message,
        });
    }
};

const getAllWarehousesCont = async (request, response) => {
	try {
		const { page, pageSize } = request.query;
		const { data, meta } = await getAllWarehouses(page, pageSize);
		response.code(200).send({
			status: true,
			message: "success",
			data: data,
			meta_data: meta,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const getOneWarehouseCont = async (request, response) => {
	try {
		const { id } = request.params;
		const warehouse = await getOneWarehouse(id);
		response.code(200).send({
			status: true,
			message: "success",
			data: warehouse ? warehouse : "warehouse not found",
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const updateWarehouseCont = async (request, response) => {
	try {
		const { id } = request.params;
		const body = request.body;
		const warehouse = await updateWarehouse(id, body);
		response.code(200).send({
			status: true,
			message: "success",
			data: warehouse,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const deleteWarehouseCont = async (request, response) => {
	try {
		const { id } = request.params;
		const warehouse = await deleteWarehouse(id);
		response.code(200).send({
			status: true,
			message: "success",
			data: warehouse,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

module.exports = {
	createWarehouseCont,
	getAllWarehousesCont,
	getOneWarehouseCont,
	updateWarehouseCont,
	deleteWarehouseCont,
};
