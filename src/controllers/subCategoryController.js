const subCategoryService = require("../services/subCategoryService");

const createSubCategory = async (request, response) => {
	try {
		const subCategories = await subCategoryService.createSubCategory(request.body);
		response.code(200).send({
			status: true,
			message: "SubCategory created",
			data: subCategories,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const getSubCategoryWithProduct = async (request, response) => {
	try {
		const { category_id, page, pageSize } = request.query;
		const allSubCategories = await subCategoryService.getSubCategoriesAlongProducts(page, pageSize, category_id);
		response.code(200).send({
			status: true,
			message: "Success",
			data: allSubCategories,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const getSingleSubCategory = async (request, respone) => {
	try {
		const { id } = request.params;
		const subCategory = await subCategoryService.getSingleSubCategory(id);
		respone.code(200).send({
			status: true,
			message: "Success",
			data: subCategory ? subCategory : "SubCategory not found",
		});
	} catch (error) {
		respone.status(400).send({
			status: false,
			message: error.message,
		});
	}
};

const updateSubCategory = async (request, response) => {
	try {
		const { id } = request.params;
		const body = request.body;
		const subCategory = await subCategoryService.updateSubCategory(id, body);
		response.code(200).send({
			status: true,
			message: "Sub Category Updated",
			data: subCategory,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const deleteSubCategory = async (request, respone) => {
	try {
		const { id } = request.params;
		const subCategory = await subCategoryService.deleteSubCategory(id);
		respone.code(200).send({
			status: true,
			message: "SubCategory has been deleted",
			data: subCategory,
		});
	} catch (error) {
		respone.status(400).send({
			status: true,
			message: error.message,
		});
	}
};

module.exports = {
	createSubCategory,
	getSubCategoryWithProduct,
	getSingleSubCategory,
	updateSubCategory,
	deleteSubCategory,
};
