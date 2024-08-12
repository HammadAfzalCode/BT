const { create, findAll, findOne, update, remove } = require("../repositories/storeRepository");

const createStore = async (storeData) => {
    const createdStore = await create(storeData);
    return createdStore;
};

const getAllStores = async (page, pageSize) => {

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

const getOneStore = async (id) => {
    const filter = { id }
    return await findOne(filter);
};

const updateStore = async (id, payload) => {
    const filter = { id }
    return await update(filter, payload);
};

const deleteStore = async (id) => {
    const filter = { id }
    return await remove(filter);
};

module.exports = {
    createStore,
    getAllStores,
    getOneStore,
    updateStore,
    deleteStore,
};
