const _ = require('lodash');
const Boom = require('@hapi/boom');
const { In } = require('typeorm');
const { dataSource } = require("../../infrastructure/postgres");
const { create, findAll, findOne, update, remove, findMyOrders, findOrdersByFilter } = require("../repositories/orderRepository");
const { createOrderItem, updateOrderItem, bulkInsertOrderItems } = require("../repositories/orderItemsRepository");
const { assignValueToEachObject } = require("../utils/objectFunctions");
const { getWorkplace } = require('../repositories/workplaceRepo');
const { getStore } = require('../repositories/storeRepository');
const { createOrderStatusLogs, getOrderStatusLogs } = require('../repositories/orderStatusLogsRepository');
const { getUserCartRepository } = require('../repositories/cartRepository');
const { getCartItemRepository, deleteCartItemRepository } = require('../repositories/cartItemsRepo');
const { updateProductQuantityInInventory } = require('../repositories/inventoryRepository');
const { totalCalculator, moneyValueAddition } = require("../utils/priceFormatter");
const { createInterimInvoice } = require("../repositories/interimInvoiceRepository");
const { bulkInsertInterimInvoiceItems } = require("../repositories/interimInvoiceItemRepository");
const { addToCartService } = require("../services/cartItemsService");

const createOrder = async (orderData) => {
    const createdOrder = await create(orderData);
    const orderItems = orderData.items;
    for (const item of orderItems) {
        const itemObject = { ...item, order_id: createdOrder.data.id };
        await createOrderItem(itemObject);
    }
    return "order created succesfully"
};

const addPreviousOrderItemsToCart = async (userId, previousOrderItems) => {
    const itemsAddedToCart = [];
	for (const item of previousOrderItems) {
        const itemAdded = await addToCartService(userId, item.product_id, item.ordered_quantity);
        itemsAddedToCart.push(itemAdded);
	}
    return itemsAddedToCart;
};

const reOrderService = async (userId, orderId) => {
    const previousOrder = await findOne({ id: orderId, user_id: userId });
    if (previousOrder?.order_status !== "completed") {
        throw Boom.forbidden("Incompleted orders cannot be reorder!");
    }
    const itemAddedToCart = await addPreviousOrderItemsToCart(userId, previousOrder.orderDetails);
    return itemAddedToCart;
}

const getAllOrders = async (page, pageSize) => {
    
	const pageNumber = parseInt(page || "1", 10);
	const limit = parseInt(pageSize || "10", 10);

	const offset = (pageNumber - 1) * limit;

	const { data, totalCount } = await findAll(offset, limit);

	const totalPages = Math.ceil(totalCount / limit);

	return {
		data: data,
		meta: {
			totalCount: totalCount,
			currentPage: pageNumber,
			totalPages: totalPages,
		},
	};
};

const getMyStoreOrders = async (page, pageSize, status, workplace_id, workplace_type) => {
    const pageNumber = parseInt(page || "1", 10);
    const limit = parseInt(pageSize || "10", 10);

    const workplaceObj = await getWorkplace({ id: workplace_id, workplace_type: workplace_type })
    if (_.isNil(workplaceObj)) throw Boom.badData("The store does not exists")

    const store = await getStore({ id: workplaceObj?.workplace_id })
    if (_.isNil(store)) throw Boom.badData("The store does not exists")
	
    const filter = { store_id: store?.id };
    const offset = (pageNumber - 1) * limit;
    const filterObject = {
        'in-process': ["picked", "packed" ],
        'in-transit': ["in-transit"],
        "claimed": ['claimed'],
        "completed": ["completed"],
        "ongoing": ["picked", "packed", "in-transit", "claimed"]
    };
    if (!_.isUndefined(status)) filter['order_status'] = In(filterObject[status]);
    const { data, totalCount } = await findOrdersByFilter(offset, limit, filter);

    data.forEach((order, index, array)=>{
        array[index] = {
            ...order,
            ...(productDecorator(order.orderDetails, order)),
        }
    })

    const totalPages = Math.ceil(totalCount / limit);

	return {
		data: data,
		meta: {
			totalCount: totalCount,
			currentPage: pageNumber,
			totalPages: totalPages,
		},
	};
};

const productDecorator = (productDetails, order) => {

    const newOrderDetails = {
        orderDetails: [],
        total_bill: '$0.0'
    }

    if (_.isEmpty(productDetails)) return newOrderDetails

    let totalAmount = '$0.0'
    let shippedQuantityStatuses = ["pending", "accepted", "rejected"]
    newOrderDetails['orderDetails'] = productDetails.map((element) => {
        const filteredObject = {}
        filteredObject['id'] = element?.id ?? '',
        filteredObject['product_id'] = element?.product?.id ?? '',
        filteredObject['title'] = element?.product?.title ?? '',
        filteredObject['unit_price'] = element?.product?.unit_price ?? '$0.0',
        filteredObject['selling_price'] = element?.product?.selling_price ?? '$0.0',
        filteredObject['image_url'] = element?.product?.thumbnail_image_url ?? '',
        filteredObject['quantity'] = shippedQuantityStatuses.includes(order.order_status) ? element?.ordered_quantity : element?.shipped_quantity ?? 0,
        filteredObject['items_total_amount'] = totalCalculator(element?.product?.selling_price, parseInt(filteredObject.quantity))
        totalAmount = moneyValueAddition(totalAmount, filteredObject["items_total_amount"]);
        newOrderDetails['total_bill'] = totalAmount
        return filteredObject
    })

    newOrderDetails.total_bill = moneyValueAddition(newOrderDetails.total_bill, order.shipping_cost);
    return newOrderDetails
}

const getOneOrder = async (order_id) => {
    const filter = { id: order_id }
    return await findOne(filter);
};

const getOrderStatusDetails = async (order_id) => {
    const filter = { order_id }
    const orderStatusDetails = await getOrderStatusLogs(filter)
    return orderStatusDetails
}

const updateOrder = async (id, status, user_id, products) => {
    const filter = { id: id }
    const canBeUpdated = await getAvailableTransitions(filter, status);
    const updatedOrder = (canBeUpdated) ? await update(filter, { order_status: status }) : {};
    if (status == 'picked' && !_.isEmpty(products)) {
        products.forEach( async (product) => {
            await updateOrderItem({ order_id: id, product_id: product?.product_id }, { shipped_quantity: product?.shipped_quantity });
            await updateProductQuantityInInventory({ warehouse_id: updatedOrder.warehouse_id, product_id: product?.product_id }, { quantity: product?.shipped_quantity });
        })
    }
    await createOrderStatusLogs({
        order_id: id, 
        order_status: status, 
        updated_by : user_id
    })
    return updatedOrder
};

const deleteOrder = async (id) => {
	const filter = { id };
	return await remove(filter);
};

const getAvailableTransitions = async (filter, updateStatusTo) => {

    const states = {
        'pending': ['accepted', 'canceled'],
        'accepted': ['picked', 'canceled'],
        'picked': ['packed'],
        'packed': ['in-transit'],
        'in-transit': ['completed', 'claimed'],
        'claimed': ['completed', "claimed"],
        'canceled': [],
        'completed': []
    };

	const orderData = await findOne(filter);

    if (orderData && states[orderData.order_status].includes(updateStatusTo)) {
        return true
    } else {
        throw Boom.forbidden(`Invalid transition from ${orderData.order_status} to ${updateStatusTo}`);
    }
}

const warehouseOrders = async (page, pageSize, status, workplaceId, workplace_type) => {

    const pageNumber = parseInt(page || "1", 10);
    const limit = parseInt(pageSize || "10", 10);

    const workplace = await getWorkplace({ id: workplaceId, workplace_type });

    if(_.isNil(workplace)) throw Boom.forbidden("The workplace does not exists")

	const filter = {
		warehouse_id: workplace.workplace_id,
	};

	const statusMapping = {
		requests: ["accepted"],
		ongoing: ["picked", "packed"],
		"in-transit": ["in-transit"],
        picked: ["picked"],
        packed: ["packed"],
        process: ["accepted"],
	};

    if (!_.isUndefined(status) && !_.isUndefined(statusMapping[status])) filter["order_status"] = In(statusMapping[status]);

    const offset = (pageNumber - 1) * limit;

	const { data, totalCount } = await findOrdersByFilter(offset, limit, filter);

    data.forEach((order, index, array)=>{
        array[index] = {
            ...order,
            ...(productDecorator(order.orderDetails, order))
        }
    })

    const totalPages = Math.ceil(totalCount / limit);

    return {
        data: data,
        meta: {
            totalCount: totalCount,
            currentPage: pageNumber,
            totalPages: totalPages,
        },
    }
};

const placeOrderService = async (user_id, workplace_id, workplace_type) => {

    const queryRunner = dataSource.createQueryRunner();
	await queryRunner.connect();
	await queryRunner.startTransaction();

    try {

        let totalBill = '$0';

        const workplace = await getWorkplace({ id: workplace_id, workplace_type });
        if (_.isNil(workplace)) throw Boom.badData("The workplace to which you belong does not exists");

        const userCart = await getUserCartRepository({ user_id: user_id, store_id: workplace.workplace_id });
        if (_.isNil(userCart)) throw Boom.badData("User cart does not exists");

        const cartItems = await getCartItemRepository({ cart_id: userCart.id });
        if (_.isEmpty(cartItems)) throw Boom.badData("Please insert product in your cart to place an order");

        const order = await create({ user_id: user_id, store_id: workplace.workplace_id, shipping_cost: userCart.shipping_cost, discount_percentage: userCart.discount_percentage });
                
        const orderItems = cartItems.map((cartItem) => {

            const totalItemPrice = totalCalculator(cartItem.product.selling_price, cartItem.quantity);
            totalBill = moneyValueAddition(totalBill, totalItemPrice);

            return {
                ordered_quantity: cartItem.quantity,
                order_id: order.id,
                product_id: cartItem.product_id,
                unit_price: cartItem.product.unit_price,
            }
        })

        await bulkInsertOrderItems(orderItems);
        await deleteCartItemRepository({ cart_id: userCart.id });
        const invoiceData = await createInterimInvoice({ order_id: order.id, total_bill: totalBill, shipping_cost: order.shipping_cost, discount_percentage: userCart.discount_percentage });
        assignValueToEachObject(orderItems, 'interim_invoice_id', invoiceData.id)
        await bulkInsertInterimInvoiceItems(orderItems);

        await queryRunner.commitTransaction();

        return order

    } catch (error) {
		await queryRunner.rollbackTransaction();
		throw error
    } finally {
		await queryRunner.release();
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getMyStoreOrders,
    getOneOrder,
    reOrderService,
    updateOrder,
    deleteOrder,
    getOrderStatusDetails,
	warehouseOrders,
    placeOrderService,
};
