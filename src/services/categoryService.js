const { create, findAll, findOne, update, remove } = require("../repositories/categoryRepository");

const createCategory = async (categoryInfo) => {
    return await create(categoryInfo);
};

const getCategories = async (page = 1, pageSize = 10) => {

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

const getSingleCategory = async (id) => {
    const filter = { id }
    return await findOne(filter);
};

const updateCategory = async (id, payload) => {
    const filter = { id }
    return await update(filter, payload);
};

const removeCategory = async (id) => {
    const filter = { id }
    return await remove(filter);
};

module.exports = {
    createCategory,
    getCategories,
    getSingleCategory,
    updateCategory,
    removeCategory,
};
