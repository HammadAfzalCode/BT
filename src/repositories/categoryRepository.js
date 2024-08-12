const Boom = require("@hapi/boom");
const { dataSource } = require("../../infrastructure/postgres");

const create = async (categoryInfo) => {
    const categoryRepository = dataSource.getRepository("Category");
    const category = categoryRepository.create(categoryInfo);
    const save = await categoryRepository.save(category);
    return save;
};

const findAll = async (offset, limit) => {
    const categoryRepository = dataSource.getRepository("Category");
    const [data, totalCount] = await categoryRepository.findAndCount({
        skip: offset,
        take: limit,
    });
    return {
        data,
        totalCount,
    };
};

const findOne = async (filter) => {
    const categoryRepository = dataSource.getRepository("Category");
    const singleCategory = await categoryRepository.findOne({where: filter});
    return singleCategory;
};

const update = async (filter, payload) => {
    const categoryRepository = dataSource.getRepository("Category");
    const existingCategory = await categoryRepository.findOne({ where: filter });
    if (existingCategory) {
        const updatedPayload = {
            ...payload,
            updated_at: new Date(),
        };
        const update = categoryRepository.merge(existingCategory, updatedPayload);
        const save = await categoryRepository.save(update);
        return save;
    } else {
        throw Boom.notFound('Category does not exist');
    }
};

const remove = async (filter) => {
    const categoryRepository = dataSource.getRepository("Category");
    const existingCategory = await categoryRepository.findOne({ where: filter });
    if (existingCategory) {
        await categoryRepository.delete({ where: filter });
        return 'Category has been deleted ';
    } else {
        throw Boom.notFound('Category does not exist');
    }
};

const getAllCategorires = () => {
    const categoryRepository = dataSource.getRepository("Category");
    const categories = categoryRepository.find()
    return categories
}

async function bulkCategoriesUpsert(categories) {
    const repository = dataSource.getRepository("Category");
    await repository.upsert(categories, ['name']);
}

module.exports = {
    create,
    findAll,
    findOne,
    update,
    remove,
    bulkCategoriesUpsert,
    getAllCategorires,
};
