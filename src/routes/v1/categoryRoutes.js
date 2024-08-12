const { createCategory, getCategories, getSingleCategory, updateCategory, deleteCategory } = require("../../controllers/categoryController");
const { userAuthentication } = require("../../middlewares/authMiddleware");
const { categoryCreateSchema, categoryBodySchema, getCategoriesSchema } = require("../../schemas/categorySchema");

module.exports = async (fastify, option) => {
  fastify.route({
		method: "POST",
		url: "/create-category",
		schema: categoryBodySchema,
		validatorCompiler: (schema) => (data) => {
			return categoryCreateSchema.validate(data);
		},
		preHandler: userAuthentication,
		handler: createCategory,
  });

  fastify.route({
		method: "GET",
		url: "/get-categories",
		schema: getCategoriesSchema,
		preHandler: userAuthentication,
		handler: getCategories,
  });

  fastify.route({
		method: "GET",
		url: "/get-category/:id",
		preHandler: userAuthentication,
		handler: getSingleCategory,
  });

  fastify.route({
		method: "PUT",
		url: "/update-category/:id",
		preHandler: userAuthentication,
		handler: updateCategory,
  });

  fastify.route({
		method: "DELETE",
		url: "/delete-category/:id",
		preHandler: userAuthentication,
		handler: deleteCategory,
  });

};
