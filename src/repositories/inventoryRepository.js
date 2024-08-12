const _ = require("lodash");
const Boom = require("@hapi/boom");
const { dataSource } = require("../../infrastructure/postgres");

// Retrieves the count of low stock items for a specific warehouse.
async function getLowStockItemsCount(warehouse_id) {
  const inventoryRepository = dataSource.getRepository("Inventory");
  const lowStockItems = await inventoryRepository.query(
    `SELECT COUNT(*) AS count FROM inventory 
     WHERE quantity <= low_stock_threshold AND quantity != 0 
     AND warehouse_id = $1 AND is_deleted = $2`,
    [warehouse_id, false]
  );
  return lowStockItems[0];
}

// Retrieves the count of out of stock items for a specific warehouse.
async function getOutOfStockCount(warehouse_id) {
  const inventoryRepository = dataSource.getRepository("Inventory");
  const outOfStock = await inventoryRepository.query(
    `SELECT COUNT(*) AS count FROM inventory 
     WHERE quantity = 0 AND warehouse_id = $1 
     AND is_deleted = $2`,
    [warehouse_id, false]
  );
  return outOfStock[0];
}

// Retrieves the count of items with short expiry dates for a specific warehouse.
const getShortExpiryCount = async (warehouseId, expiryThreshold) => {
  const repository = dataSource.getRepository("Batches");
  const result = await repository
    .createQueryBuilder("batches")
    .leftJoinAndSelect("batches.product", "product")
    .select(["COUNT(batches.id) AS count"])
    .where("batches.warehouse_id = :warehouseId", { warehouseId })
    .andWhere("batches.expiry_date::date <= :expiryDate", {
      expiryDate: expiryThreshold,
    })
    .getRawOne();

  return result;
};

// Retrieves the items with short expiry dates for a specific warehouse.
const getShortExpiryItems = async (warehouseId, expiryThreshold) => {
  const repository = dataSource.getRepository("Batches");
  const result = await repository
    .createQueryBuilder("batches")
    .leftJoinAndSelect("batches.product", "product")
    .select([
      "product.id",
      "product.title",
      "batches.expiry_date",
      "batches.quantity",
    ])
    .where("batches.warehouse_id = :warehouseId", { warehouseId })
    .andWhere("batches.expiry_date::date <= :expiryThreshold", {
      expiryThreshold: expiryThreshold,
    })
    .getMany();

  return result;
};

// Retrieves the filtered inventory for a specific warehouse.
const findFilteredInventory = async (warehouse_id, filter) => {
  const inventoryRepository = dataSource.getRepository("Inventory");
  const query = inventoryRepository
    .createQueryBuilder("inventory")
    .leftJoinAndSelect("inventory.product", "product")
    .where({ warehouse_id });

  if (filter) {
    query.andWhere(filter);
  }

  const result = await query
    .select([
      "inventory.id",
      "inventory.quantity",
      "inventory.warehouse_id",
      "inventory.low_stock_threshold",
      "product.id",
      "product.title",
      "product.unit_price",
      "product.selling_price",
      "product.thumbnail_image_url",
    ])
    .getMany();

  return result;
};

const findFilteredInventoryAllWarehouses = async (filter, expiryThreshold) => {
  const inventoryRepository = dataSource.getRepository("Inventory");

  const query = inventoryRepository
    .createQueryBuilder("inventory")
    .leftJoinAndSelect("inventory.product", "product")
    .leftJoinAndSelect("inventory.warehouse", "warehouse");

  if (filter) {
    query.andWhere(filter);
  }

  if (expiryThreshold) {
    query.andWhere("inventory.created_at::date <= :expiryThreshold", {
      expiryThreshold: expiryThreshold,
    });
  }

  return query
    .select([
      "inventory.id",
      "inventory.quantity",
      "inventory.low_stock_threshold",
      "product.id",
      "product.title",
      "product.unit_price",
      "product.selling_price",
      "product.thumbnail_image_url",
      "warehouse.id",
      "warehouse.name",
      "warehouse.location",
    ])
    .getMany();
};

module.exports = {
  getLowStockItemsCount,
  getOutOfStockCount,
  getShortExpiryCount,
  getShortExpiryItems,
  findFilteredInventory,
  findFilteredInventoryAllWarehouses,
};
