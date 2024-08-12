const { getSubCategoriesSchema } = require('../../schemas/subCategorySchema');
const { createSubCategory, getSubCategoryWithProduct, getSingleSubCategory, updateSubCategory, deleteSubCategory } = require("../../controllers/subCategoryController");

module.exports = async(fastify, option) =>{
    fastify.route({
        method: "POST",
        url: "/create-sub-category",
        handler: createSubCategory,
    });

    fastify.route({
        method: "GET",
        url: "/get-sub-category",
        schema: getSubCategoriesSchema,
        handler: getSubCategoryWithProduct,
    });

    // fastify.route({
    //     method: "GET",
    //     url: "/get-one-sub-category/:id",
    //     handler: getSingleSubCategory,
    // });

    fastify.route({
        method: "PUT",
        url: "/update-sub-category/:id",
        handler: updateSubCategory,
    });

    fastify.route({
        method: "DELETE",
        url: "/delete-sub-category/:id",
        handler: deleteSubCategory,
    });
};