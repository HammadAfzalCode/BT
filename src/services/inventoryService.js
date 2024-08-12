const _ = require("lodash");
const Boom = require("@hapi/boom");
const {
  getLowStockItemsCount,
  getOutOfStockCount,
  findFilteredInventory,
  getShortExpiryCount,
  getShortExpiryItems,
  getLowStockItemsCountAllWarehouses,
  getOutOfStockCountAllWarehouses,
  getShortExpiryCountAllWarehouses,
  findFilteredInventoryAllWarehouses,
} = require("../repositories/inventoryRepository");
const { getWorkplace } = require("../repositories/workplaceRepo");
const { dateAfterNDays } = require("../utils/dateTimeFunctions");
const { warehouseClaimsCountService } = require("./claimsService");

const dashboardDetails = async (workplaceId, workplace_type) => {
  const workplace = await getWorkplace({
    id: workplaceId,
    workplace_type,
  });

  if (_.isNil(workplace)) throw Boom.forbidden("The workplace does not exist");

  const dateAfterFifteenDays = dateAfterNDays(15);

  const lowStockItems = await getLowStockItemsCount(workplace.workplace_id);
  const outOfStock = await getOutOfStockCount(workplace.workplace_id);
  const shortExpiry = await getShortExpiryCount(
    workplace.workplace_id,
    dateAfterFifteenDays
  );
  const claims = await warehouseClaimsCountService(workplace.workplace_id);

  const returnObject = {
    lowStockItems: parseInt(lowStockItems.count),
    outOfStock: parseInt(outOfStock.count),
    shortExpiry: shortExpiry,
    claims: parseInt(claims),
  };
  return returnObject;
};

const shortExpiryProuductService = async (workplaceId, workplace_type) => {
  const workplace = await getWorkplace({
    id: workplaceId,
    workplace_type,
  });

  if (_.isNil(workplace)) throw Boom.forbidden("The workplace does not exist");

  const dateAfterFifteenDays = dateAfterNDays(15);

  const shortExpiry = await getShortExpiryItems(
    workplace.workplace_id,
    dateAfterFifteenDays
  );
  return shortExpiry;
};

const warehouseInventory = async (workplaceId, workplace_type, filterBy) => {
  let filter;

  const workplace = await getWorkplace({
    id: workplaceId,
    workplace_type,
  });

  if (_.isNil(workplace)) throw Boom.forbidden("The workplace does not exist");

  const filterConditions = {
    "low-stock": "quantity < low_stock_threshold AND quantity != 0",
    "out-of-stock": { quantity: 0 },
  };

  if (!_.isUndefined(filterBy)) filter = filterConditions[filterBy];

  const data = await findFilteredInventory(workplace.workplace_id, filter);
  return data;
};

const allWarehouseInventory = async (filterBy) => {
  let filter = {};
  let expiryThreshold = null;

  const filterConditions = {
    "low-stock": "quantity < low_stock_threshold AND quantity != 0",
    "out-of-stock": { quantity: 0 },
  };

  if (!_.isUndefined(filterBy)) {
    filter = filterConditions[filterBy];
    if (filterBy === "short-expiry") {
      expiryThreshold = dateAfterNDays(-15); // items created more than 15 days ago
    }
  }

  const data = await findFilteredInventoryAllWarehouses(
    filter,
    expiryThreshold
  );

  return data;
};

const allWarehouseInventoryCount = async () => {
  const results = {};

  // Low Stock
  const lowStockFilter = "quantity < low_stock_threshold AND quantity != 0";
  const lowStockData = await findFilteredInventoryAllWarehouses(lowStockFilter);
  results.lowStockCount = lowStockData.length;

  // Out of Stock
  const outOfStockFilter = { quantity: 0 };
  const outOfStockData = await findFilteredInventoryAllWarehouses(
    outOfStockFilter
  );
  results.outOfStockCount = outOfStockData.length;

  // Short Expiry
  const expiryThreshold = dateAfterNDays(-15); // items created more than 15 days ago
  const shortExpiryData = await findFilteredInventoryAllWarehouses(
    null,
    expiryThreshold
  );
  results.shortExpiryCount = shortExpiryData.length;

  return results;
};

module.exports = {
  dashboardDetails,
  warehouseInventory,
  shortExpiryProuductService,
  getLowStockItemsCountAllWarehouses,
  getOutOfStockCountAllWarehouses,
  getShortExpiryCountAllWarehouses,
  findFilteredInventoryAllWarehouses,
  allWarehouseInventoryCount,
  allWarehouseInventory,
};
