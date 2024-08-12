const Boom = require("@hapi/boom");
const { logger } = require("../../logger");
const { dataSource } = require("../../infrastructure/postgres");

const create = async (productData) => {
	const productRepository = dataSource.getRepository("Product");
	const payload = {
		...productData,
		created_at: new Date(),
		updated_at: new Date(),
	};
	const createProduct = productRepository.create(payload);
	const data = await productRepository.save(createProduct);
	return data;
};

const findAll = async (offset, limit, filter) => {
	const productRepository = dataSource.getRepository("Product");
	const [data, totalCount] = await productRepository
		.createQueryBuilder("product")
		.leftJoinAndSelect("product.inventory", "inventory")
		.select(["product", "inventory.id", "inventory.quantity"])
		.where(filter)
		.take(limit)
		.offset(offset)
		.getManyAndCount();

	return {
		data,
		totalCount,
	};
};

const findOne = async (filter) => {
	const productRepository = dataSource.getRepository("Product");
	const data = await productRepository
		.createQueryBuilder("product")
		.select([
			"product.id",
			"product.title",
			"product.description",
			"product.thumbnail_image_url",
			"product.box_barcode",
			"product.unit_barcode",
			"product.pack_of",
			"product.unit_price",
			"product.selling_price",
			"product.category_id",
			"product.sub_category_id",
			"product.created_at",
			"product.updated_at",
		])
		.where(filter)
		.orWhere(`unit_barcode = :unit_barcode`, { unit_barcode: filter?.box_barcode })
		.getOne();

	return data;
};

const update = async (filter, payload) => {
	const productRepository = dataSource.getRepository("Product");
	const existingProduct = await productRepository.findOne({ where: filter });
	if (existingProduct) {
		const updatedPayload = {
			...payload,
			updated_at: new Date(),
		};
		const update = productRepository.merge(existingProduct, updatedPayload);
		const data = await productRepository.save(update);
		return data;
	} else {
		throw Boom.notFound("Product doesn't exist");
	}
};

const remove = async (filter) => {
	const productRepository = dataSource.getRepository("Product");
	const existingProduct = await productRepository.findOne({ where: filter });
	if (existingProduct) {
		await productRepository.delete({ where: filter });
		return "Product deleted successfully";
	} else {
		throw Boom.notFound("Product doesn't exist");
	}
};

const bulkProductsUpsert = async (products) => {
	const repository = dataSource.getRepository("Product");
	await repository.upsert(products, ["box_barcode"]);
}

const getProductTitleListRepository = async () => {
	const productRepository = dataSource.getRepository("Product");
	const data = await productRepository
		.createQueryBuilder("product")
		.select(["product.id", "product.title"])
		.getMany();
	return data
};

module.exports = {
	create,
	findAll,
	bulkProductsUpsert,
	findOne,
	update,
	remove,
	getProductTitleListRepository,
};
