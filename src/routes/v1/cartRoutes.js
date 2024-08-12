const { createCart, getAllCart, getSingleCart } = require("../../controllers/cartController");
const { userAuthentication } = require("../../middlewares/authMiddleware");
const { getMyCartSchema } = require("../../schemas/cartSchema")
module.exports = async (fastify, option) => {
    // fastify.route({
    //     method: "POST",
    //     url: "/create-cart",
    //     handler: createCart,
    // });

    // fastify.route({
    //     method: "GET",
    //     url: "/get-all-cart",
    //     handler: getAllCart,
    // });

    fastify.route({
        method: "GET",
        url: "/get-my-cart",
        schema: getMyCartSchema,
        preHandler: userAuthentication,
        handler: getSingleCart,
    });

    // fastify.route({
    //     method: "PUT",
    //     url: "/update-cart/:id",
    //     handler: updateCart,
    // });

    // fastify.route({
    //     method: "DELETE",
    //     url: "/delete-cart/:id",
    //     handler: deleteCart,
    // });

};