const { logger } = require("../../logger");
const storeService = require("../services/storeService");

const createStore = async (request, response) => {
    logger.info("data: ", request.body);
    try {
        const product = await storeService.createStore(request.body);
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

const getAllStores = async (request, response) => {
    try {
        const { page, pageSize } = request.query
        const { data, meta } = await storeService.getAllStores(page, pageSize);
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

const getOneStore = async (request, response) => {
    try {
        const { id } = request.params;
        const store = await storeService.getOneStore(id);
        response.code(200).send({
            status: true,
            message: "success",
            data: store ? store : "store not found",
        });
    } catch (error) {
        response.code(400).send({
            status: false,
            message: error.message,
        });
    }
};

const updateStore = async (request, response) => {
    try {
        const { id } = request.params;
        const body = request.body;
        const product = await storeService.updateStore(id, body);
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

const deleteStore = async (request, response) => {
    try {
        const { id } = request.params;
        const store = await storeService.deleteStore(id);
        response.code(200).send({
            status: true,
            message: "success",
            data: store,
        });
    } catch (error) {
        response.code(400).send({
            status: false,
            message: error.message,
        });
    }
};

module.exports = {
    createStore,
    getAllStores,
    getOneStore,
    updateStore,
    deleteStore,
};
