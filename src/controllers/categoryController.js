const { logger } = require("../../logger");
const categoryService = require("../services/categoryService");

const createCategory = async (request, response) => {
	try {
		const categories = await categoryService.createCategory(request.body);
		logger.info("src > categoryController > createCategory");
		logger.info(categories);
		response.code(200).send({
			status: true,
			message: "category created successfully",
			data: categories,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const getCategories = async (request, response) => {
	try {
		const { page, pageSize } = request.query
		const { data, meta } = await categoryService.getCategories(page, pageSize);
		response.code(200).send({
			status: true,
			message: "Success",
			data: data,
			meta_data: meta
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const getSingleCategory = async (request, response) => {
	try {
		const { id } = request.params;
		const category = await categoryService.getSingleCategory(id);
		response.code(200).send({
			status: true,
			message: "Success",
			data: category ? category : "Category not found",
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const updateCategory = async (request, response) => {
	try {
		const { id } = request.params;
		const body = request.body;
		const category = await categoryService.updateCategory(id, body);
		response.code(200).send({
			status: true,
			message: "Category Updated",
			data: category,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const deleteCategory = async (request, response) => {
	try {
		const { id } = request.params;
		const category = await categoryService.removeCategory(id);
		response.code(200).send({
			status: true,
			message: "Category Deleted",
			data: category,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

module.exports = {
	createCategory,
	getCategories,
	getSingleCategory,
	updateCategory,
	deleteCategory,
};
