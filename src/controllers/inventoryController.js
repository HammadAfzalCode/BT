const { logger } = require("../../logger");
const {
  dashboardDetails,
  warehouseInventory,
  shortExpiryProuductService,
  allWarehouseInventory,
  allWarehouseInventoryCount,
} = require("../services/inventoryService");

const getDashboardDetails = async (request, response) => {
  try {
    const { workplace_id, workplace_type } = request.user;
    const dashboard = await dashboardDetails(workplace_id, workplace_type);
    response.code(200).send({
      status: true,
      message: "success",
      data: dashboard,
    });
  } catch (error) {
    logger.error(error.message);
    response.code(400).send({
      status: false,
      message: error.message,
    });
  }
};

const getWarehouseInventory = async (request, response) => {
  try {
    const { workplace_id, workplace_type } = request.user;
    const { filterBy } = request.query;
    if (!filterBy) throw Error("please provide filterBy in parameter");
    const inventory = await warehouseInventory(
      workplace_id,
      workplace_type,
      filterBy
    );
    response.code(200).send({
      status: true,
      message: "success",
      data: inventory,
    });
  } catch (error) {
    logger.error(error.message);
    response.code(400).send({
      status: false,
      message: error.message,
    });
  }
};

const getAllWarehouseInventory = async (request, response) => {
  try {
    const { filterBy } = request.query;
    if (!filterBy) throw Error("please provide filterBy in parameter");
    const inventories = await allWarehouseInventory(filterBy);
    response.code(200).send({
      status: true,
      message: "success",
      data: inventories,
    });
  } catch (error) {
    logger.error(error.message);
    response.code(400).send({
      status: false,
      message: error.message,
    });
  }
};
const getAllWarehouseInventoryCount = async (request, response) => {
  try {
    // const { filterBy } = request.query;
    // if (!filterBy) throw Error("please provide filterBy in parameter");
    const inventories = await allWarehouseInventoryCount();
    response.code(200).send({
      status: true,
      message: "success",
      data: inventories,
    });
  } catch (error) {
    logger.error(error.message);
    response.code(400).send({
      status: false,
      message: error.message,
    });
  }
};

const getShortExpiryProducts = async (request, response) => {
  try {
    const { workplace_id, workplace_type } = request.user;
    const result = await shortExpiryProuductService(
      workplace_id,
      workplace_type
    );
    response.code(200).send({
      status: true,
      message: "success",
      data: result,
    });
  } catch (error) {
    logger.error(error.message);
    response.code(400).send({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardDetails,
  getWarehouseInventory,
  getShortExpiryProducts,
  getAllWarehouseInventory,
  getAllWarehouseInventoryCount,
};
