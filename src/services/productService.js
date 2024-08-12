const Joi = require('joi');
const _ = require('lodash');
const { PinoLogger, logger } = require('../../logger');
const Boom = require('@hapi/boom');
const csvParser = require('csv-parser');
const { create, findAll, findOne, update, remove, bulkProductsUpsert, getProductTitleListRepository } = require("../repositories/productRepository");
const { getAllCategorires, bulkCategoriesUpsert } = require("../repositories/categoryRepository");
const { bulkSubCategoriesUpsert, getAllSubCategorires } = require("../repositories/subCategoryRepo");
const { findProductInventory } = require('../repositories/inventoryRepository');


const createProduct = async (productData) => {
	return await create(productData);
};

const getProductList = async (page, pageSize, category_id) => {
	
	const pageNumber = parseInt(page || "1", 10);
	const limit = parseInt(pageSize || "10", 10);
	const offset = (pageNumber - 1) * limit;
	
	const filter = {
		sub_category_id: category_id
	}
	const { data, totalCount } = await findAll(offset, limit, filter);
	const totalPages = Math.ceil(totalCount / limit);
	
	data.forEach((product) => {
		product['total_quantity'] = product.inventory.reduce((sum, item) => sum + item.quantity, 0);
		delete product.inventory;
	});

	return {
		data: data,
		meta: {
			totalCount: totalCount,
			currentPage: pageNumber,
			totalPages: totalPages,
		},
	};
};

const getOneProduct = async (filterBy, filterValue) => {
	const filter = { [filterBy]: filterValue };
	const product = await findOne(filter);
	if (_.isNil(product)) throw Boom.badRequest("product not found");
	const inventory = await findProductInventory({ product_id: product.id });
	product["quantity"] = inventory.reduce((sum, item) => sum + item.quantity, 0);
	return product;
};

const updateProduct = async (id, payload) => {
	const filter = { id }
	return await update(filter, payload);
};

const deleteProduct = async (id) => {
	const filter = { id }
	return await remove(filter);
};

const productsCsvUploadService = async (parts) => {

	if (_.isNil(parts)) throw Boom.badData('No file uploaded');

	for await (const part of parts) {

		if (part.file) {

			const mimeType = part.mimetype;

			if (mimeType !== 'text/csv') throw Boom.badData('Invalid file type. Only CSV files are allowed.');

			let validEntries = [];
			let invalidEntries = [];

			await part.file
				.pipe(csvParser())
				.on('data', (data) => {
					const schema = Joi.object({
						'CATEGORY': Joi.string().required(),
						'BRAND': Joi.string().required(),
						'FULL DESCRIPTION': Joi.string().required(),
						'UNIT UPC': Joi.string().required(),
						'BOX UPC': Joi.string().required(),
						'PACK OF': Joi.number().required().min(1),
						'UNIT PRICE': Joi.string().required(),
						'SELLING PRICE': Joi.string().required(),
						'THUMBNAIL': Joi.string().allow('')
					})

					const { error, value } = schema.validate(data)
					if (_.isNil(error)) validEntries.push(value)
					else invalidEntries.push(data)
				})
				.on('end', async () => {
					try {
						if (validEntries.length > 1000) throw Boom.badData("The CSV file has more records then the allowed limit")

						// Step 1: Insert categories
						const categories = [...new Set(validEntries.map(item => item.CATEGORY))];
						const categoryEntities = categories.map(name => ({ name: name.trim().toUpperCase() }));
						await bulkCategoriesUpsert(categoryEntities);

						// Get categories with IDs
						const savedCategories = await getAllCategorires();
						const categoryMap = savedCategories.reduce((map, category) => {
							map[category.name.toUpperCase()] = category.id;
							return map;
						}, {});

						// Step 2: Insert subcategories
						const subCategories = [...new Set(validEntries.map(item => item.BRAND))];
						const subCategoryEntities = subCategories.map(name => ({
							name: name.toUpperCase().trim(),
							category_id: categoryMap[`${validEntries.find(item => item.BRAND.toUpperCase().trim() === name.toUpperCase().trim()).CATEGORY.toUpperCase().trim()}`]
						}));
						await bulkSubCategoriesUpsert(subCategoryEntities);

						// Get subcategories with IDs
						const savedSubCategories = await getAllSubCategorires();
						const subCategoryMap = savedSubCategories.reduce((map, subCategory) => {
							map[subCategory.name] = subCategory.id;
							return map;
						}, {});

						// Step 3: Insert products
						const productEntities = validEntries.map(item => ({
							title: item['FULL DESCRIPTION'],
							unit_barcode: item['UNIT UPC'],
							box_barcode: item['BOX UPC'],
							pack_of: parseInt(item['PACK OF']) ?? null,
							unit_price: parseFloat(item['UNIT PRICE']?.replace('$', '').trim()) ?? 0,
							selling_price: parseFloat(item['SELLING PRICE']?.replace('$', '').trim()) ?? 0,
							thumbnail_image_url: item['THUMBNAIL'],
							sub_category_id: subCategoryMap[item.BRAND.toUpperCase().trim()],
							category_id: categoryMap[item.CATEGORY.toUpperCase().trim()]
						}));
						await bulkProductsUpsert(productEntities);

						logger.info({
							congrats: 'CSV data successfully imported',
							failedEntries: invalidEntries,
							successfullEntries: validEntries.length
						});

						return {
							congrats: 'CSV data successfully imported',
							failedEntries: invalidEntries.length,
							successfullEntries: validEntries.length
						};

					} catch (error) {
						logger.error(`CSV Products Importing Error: ${error?.message}`)
					}
				})
				.on('error', (error) => {
					logger.error(`Internal Server Error: ${error}`);
				})
		} else {
			throw Boom.badData('No file uploaded');
		}
	}
}

const getProductsTitleListService = async () => {
	const productList = await getProductTitleListRepository();
	if (_.isNil(productList)) throw Boom.badRequest("Products list not found");
	return productList;
};

module.exports = {
	createProduct,
	getProductList,
	getOneProduct,
	updateProduct,
	deleteProduct,
	productsCsvUploadService,
	getProductsTitleListService,
};
