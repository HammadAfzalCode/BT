const _ = require('lodash')
const { getProductByCategoryId } = require("../repositories/productRepository");
const {create, findAll, findOne, update, remove, getSubCategoriesWithProduct} = require ("../repositories/subCategoryRepo");

const createSubCategory = async(subCategoryInfo) =>{
    return await create(subCategoryInfo);
};

const getSubCategoriesAlongProducts = async(page, pageSize, category_id) =>{
    
    const pageNumber = parseInt(page || "1", 10);
	const limit = parseInt(pageSize || "10", 10);
	
	const offset = (pageNumber - 1) * limit;
	
    const filter = {}
    
    if (!_.isNil(category_id)) filter['category_id'] = category_id

    const allSubCategories = await getSubCategoriesWithProduct(offset, limit, filter);
    allSubCategories.forEach((subCat) => {
		subCat.products.forEach((product) => {
			product.total_quantity = product.inventory.reduce((sum, item) => sum + item.quantity, 0);
			delete product.inventory;
		});
	});
    return allSubCategories
};

const getSingleSubCategory = async(id) =>{
    const filter = { id };
    return await findOne(filter);
};

const updateSubCategory = async(id, payload) =>{
    const filter = { id }
    return await update(filter, payload);
};

const deleteSubCategory = async(id) =>{
    const filter = { id }
    return await remove(filter);
};

module.exports ={
    createSubCategory,
    getSubCategoriesAlongProducts,
    getSingleSubCategory,
    updateSubCategory,
    deleteSubCategory,
};