const Boom = require("@hapi/boom");
const { dataSource } = require("../../infrastructure/postgres");

const create = async (subCategoryInfo) => {
	const subCategoryRepo = dataSource.getRepository("SubCategory");
	const subCategory = subCategoryRepo.create(subCategoryInfo);
	const save = await subCategoryRepo.save(subCategory);
	return save;
};

const findAll = async (offset, limit, filter) => {
	const subCategoryRepo = dataSource.getRepository("SubCategory");
	const subCategories = await subCategoryRepo.find({
		skip: offset,
		take: limit,
		where: filter,
	});
	return subCategories;
};

const findOne = async (filter) => {
	const subCategoryRepo = dataSource.getRepository("SubCategory");
	const subCategory = subCategoryRepo.findOne({ where: filter });
	return subCategory;
};

const update = async (filter, payload) => {
	const subCategoryRepo = dataSource.getRepository("SubCategory");
	const existingSubCategory = await subCategoryRepo.findOne({ where: filter });

	if (existingSubCategory) {
		const updatedPayload = {
			...payload,
			updated_at: new Date(),
		};
		const update = subCategoryRepo.merge(existingSubCategory, updatedPayload);
		const save = await subCategoryRepo.save(update);
		return save;
	} else {
		throw Boom.notFound("subCategory does not found");
	}
};

const remove = async (filter) => {
	const subCategoryRepo = dataSource.getRepository("SubCategory");
	const existingSubCategory = subCategoryRepo.findOne({ where: filter });
	if (existingSubCategory) {
		await subCategoryRepo.delete({ where: filter });
		return "subCategory has been deleted";
	} else {
		throw Boom.notFound("subCategory does not exist");
	}
};

const getAllSubCategorires = () => {
	const subCategoryRepository = dataSource.getRepository("SubCategory");
	const subCategories = subCategoryRepository.find();
	return subCategories;
};

async function bulkSubCategoriesUpsert(subCategories) {
	const repository = dataSource.getRepository("SubCategory");
	const queryBuilder = repository.createQueryBuilder().insert().into("SubCategory").values(subCategories).orIgnore();
	await queryBuilder.execute();
}

const getSubCategoriesWithProduct = async (offset, limit, filter) => {
	const result = await dataSource
		.getRepository("SubCategory")
		.createQueryBuilder("subCategory")
		.leftJoinAndSelect("subCategory.products", "product")
		.leftJoinAndSelect("product.inventory", "inventory")
		.select([
			"subCategory.id",
			"subCategory.name",
			"product.title",
			"product.id",
			"product.thumbnail_image_url",
			"product.selling_price",
			"inventory.id",
			"inventory.product_id",
			"inventory.quantity",
		])
		.where(filter)
		.offset(offset)
		.take(limit)
		.getMany();

	return result;
};

module.exports = {
	create,
	findAll,
	findOne,
	update,
	remove,
	bulkSubCategoriesUpsert,
	getAllSubCategorires,
	getSubCategoriesWithProduct,
};
