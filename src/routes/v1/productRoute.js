const { createProduct, getProductList, getOneProduct, updateProduct, deleteProduct, productsCsvUploadController, getProductsTitleListController } = require("../../controllers/productController");
const { userAuthentication } = require("../../middlewares/authMiddleware");
const { productCreateSchema, productBodySchema, getProductListSchema, getSingleProduct, getProductTitleList } = require("../../schemas/productSchema");

module.exports = async (fastify, options) => {
	fastify.route({
		method: "POST",
		url: "/create-product",
		schema: productBodySchema,
		preHandler: userAuthentication,
		validatorCompiler: (schema) => (data) => {
			return productCreateSchema.validate(data);
		},
		handler: createProduct,
	});

	fastify.route({
		method: "GET",
		url: "/get-products-list",
		schema: getProductListSchema,
		preHandler: userAuthentication,
		handler: getProductList,
	});

	fastify.route({
		method: "GET",
		url: "/get-product",
		schema: getSingleProduct,
		preHandler: userAuthentication,
		handler: getOneProduct,
	});

	fastify.route({
		method: "PUT",
		url: "/update-product/:id",
		preHandler: userAuthentication,
		handler: updateProduct,
	});

	fastify.route({
		method: "DELETE",
		url: "/delete-product/:id",
		preHandler: userAuthentication,
		handler: deleteProduct,
	});
	
	fastify.route({
		method: "POST",
		url: "/product-csv-upload",
		preHandler: userAuthentication,
		handler: productsCsvUploadController,
	});

	fastify.route({
		method: "GET",
		url: "/product-title-list",
		schema: getProductTitleList,
		preHandler: userAuthentication,
		handler: getProductsTitleListController,
	});

};
