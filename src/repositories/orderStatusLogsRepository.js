const { dataSource } = require("../../infrastructure/postgres");

const createOrderStatusLogs = async (logData) => {
    const { order_id, order_status, updated_by } = logData
    const orderStatusLogsRepo = dataSource.getRepository("OrderStatusLogsEntity");
    const createLog = orderStatusLogsRepo.create({
        order_id, 
        order_status, 
        updated_by
    });
    const data = await orderStatusLogsRepo.save(createLog);
    return data;
};

const getOrderStatusLogs = async (filter) => {
    const orderStatusLogsRepo = dataSource.getRepository("OrderStatusLogsEntity");
    const orderStatusLogs = await orderStatusLogsRepo.find({ where: filter });
    return orderStatusLogs;
};

module.exports = {
    createOrderStatusLogs,
    getOrderStatusLogs,
}