const { create, findAll, findOne, update, remove } = require("../repositories/warehouseRepository");

const createWarehouse = async (warehouseData) => {
	const createdWarehouse = await create(warehouseData);
	return createdWarehouse;
};

const getAllWarehouses = async (page, pageSize) => {
	const pageNumber = parseInt(page || "1", 10);
	const limit = parseInt(pageSize || "10", 10);
	const offset = (pageNumber - 1) * limit;

	const { data, totalCount } = await findAll(offset, limit);
	const totalPages = Math.ceil(totalCount / limit);

	return {
		data: data,
		meta: {
			totalCount: totalCount,
			currentPage: pageNumber,
			totalPages: totalPages,
		},
	};
};

const getOneWarehouse = async (id) => {
	const filter = { id };
	return await findOne(filter);
};

const updateWarehouse = async (id, payload) => {
	const filter = { id };
	return await update(filter, payload);
};

const deleteWarehouse = async (id) => {
	const filter = { id: id };
	return await remove(filter);
};

module.exports = {
	createWarehouse,
	getAllWarehouses,
	getOneWarehouse,
	updateWarehouse,
	deleteWarehouse,
};
