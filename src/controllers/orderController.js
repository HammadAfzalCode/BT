const { logger } = require("../../logger");
const orderService = require("../services/orderService");

const createOrder = async (request, response) => {
    try {
        const { store_id } = request.params
        const order = await orderService.createOrder(store_id);
        response.code(200).send({
            status: true,
            message: "success",
            data: order,
        });
    } catch (error) {
        response.code(400).send({
            status: false,
            message: error.message,
        });
    }
};

const getAllOrders = async (request, response) => {
    try {

        const { page, pageSize } = request.query
        const { data, meta } = await orderService.getAllOrders(page, pageSize);
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

const getMyStoreOrders = async (request, response) => {
    try {
        const { workplace_id, workplace_type } = request.user;
        const { page, pageSize, status } = request.query;
        const { data, meta } = await orderService.getMyStoreOrders(page, pageSize, status, workplace_id, workplace_type);
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

const reOrderController = async (request, response) => {
    try {
		const { order_id } = request.body;
        const { user_id } = request.user;
		const reorder = await orderService.reOrderService(user_id, order_id);
		response.code(200).send({
			status: true,
			message: "Order items added to your cart",
			data: reorder ,
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
}

const getOneOrder = async (request, response) => {
    try {
        const { order_id } = request.params;
        const order = await orderService.getOneOrder(order_id);
        response.code(200).send({
            status: true,
            message: "success",
            data: order ? order : "order not found",
        });
    } catch (error) {
        response.code(400).send({
            status: false,
            message: error.message,
        });
    }
};

const updateOrder = async (request, response) => {
    try {
        const { user_id } = request.user
        const { order_id, status, products } = request.body;
        const order = await orderService.updateOrder(order_id, status, user_id, products);
        response.code(200).send({
            status: true,
            message: "success",
            data: order,
        });
    } catch (error) {
        response.code(400).send({
            status: false,
            message: error.message,
        });
    }
};

const deleteOrder = async (request, response) => {
    try {
        const { id } = request.params;
        const order = await orderService.deleteOrder(id);
        response.code(200).send({
            status: true,
            message: "success",
            data: order,
        });
    } catch (error) {
        response.code(400).send({
            status: false,
            message: error.message,
        });
    }
};

const getOrderStatusDetails = async (request, response) => {
    try {
        const { order_id } = request.params;
        const order = await orderService.getOrderStatusDetails(order_id);
        response.code(200).send({
            status: true,
            message: "success",
            data: order ? order : "order not found",
        });
    } catch (error) {
        response.code(400).send({
            status: false,
            message: error.message,
        });
    }
};

const getWarehouseOrders = async (request, response) => {
	try {
		const { workplace_id, workplace_type } = request.user;
		const { page, pageSize, status } = request.query;
		const order = await orderService.warehouseOrders(page, pageSize, status, workplace_id, workplace_type);
		response.code(200).send({
			status: true,
			message: "success",
			data: order ? order : "orders not found",
		});
	} catch (error) {
		response.code(400).send({
			status: false,
			message: error.message,
		});
	}
};

const placeOrderController = async (request, response) => {
    try {
        const { user_id, workplace_id, workplace_type } = request.user;
        const data = await orderService.placeOrderService(user_id, workplace_id, workplace_type);
        response.code(200).send({
			status: true,
			message: "success",
			data: data ?? undefined,
		});
    } catch (error) {
        response.code(400).send({
			status: false,
			message: error.message,
		});
    }

}

module.exports = {
    createOrder,
    getAllOrders,
    reOrderController,
    getMyStoreOrders,
    getOneOrder,
    updateOrder,
    deleteOrder,
    getOrderStatusDetails,
    getWarehouseOrders,
    placeOrderController,
};
