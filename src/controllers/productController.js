const { logger } = require("../../logger");
const productServive = require("../services/productService");

const createProduct = async (request, response) => {
	logger.info("data: ", request.body);
	try {
		const product = await productServive.createProduct(request.body);
		response.code(200).send({
			status: true,
			message: "success",
			data: product,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const getProductList = async (request, response) => {
	try {
		const { category_id } = request.query;
		const { page, pageSize } = request.query
		const { data, meta } = await productServive.getProductList(page, pageSize, category_id);
		response.code(200).send({
			status: true,
			message: "success",
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

const getOneProduct = async (request, response) => {
	try {
		const { filterBy, filterValue } = request.query;
		const product = await productServive.getOneProduct(filterBy, filterValue);
		response.code(200).send({
			status: true,
			message: "success",
			data: product ? product : "product not found",
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const updateProduct = async (request, response) => {
	try {
		const { id } = request.params;
		const body = request.body;
		const product = await productServive.updateProduct(id, body);
		response.code(200).send({
			status: true,
			message: "success",
			data: product,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const deleteProduct = async (request, response) => {
	try {
		const { id } = request.params;
		const product = await productServive.deleteProduct(id);
		response.code(200).send({
			status: true,
			message: "success",
			data: product,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const productsCsvUploadController = async (request, response) => {
	try {
		const parts = request.parts();
		const result = await productServive.productsCsvUploadService(parts);
		response.code(200).send({
			status: true,
			message: "CSV has been uploaded and will be processed in a while",
			data: result,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const getProductsTitleListController = async (request, response) => {
	try {
		const result = await productServive.getProductsTitleListService();
		response.code(200).send({
			status: true,
			message: "Products Title List Successfully Send",
			data: result,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

module.exports = {
	createProduct,
	getProductList,
	getOneProduct,
	updateProduct,
	deleteProduct,
	productsCsvUploadController,
	getProductsTitleListController,
};
