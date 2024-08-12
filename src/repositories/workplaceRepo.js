const _ = require('lodash');
const { dataSource } = require("../../infrastructure/postgres");
const Boom = require('@hapi/boom');

const getWorkplace = async (filter) => {
    const workplaceRepository = dataSource.getRepository("Workplace")
    const workplace = await workplaceRepository.findOne({ where: filter })
    return workplace
}

const createWorkplace = async (workplace_type, workplace_id, options = {}) => {

    const { queryRunner } = options;

    const workplaceRepository = queryRunner ? queryRunner.manager.getRepository("Workplace") : dataSource.getRepository("Workplace");
    
    const workplace = workplaceRepository.create({
        workplace_type,
        workplace_id,
    });
	
    const savedWorkplace = await workplaceRepository.save(workplace);
	return savedWorkplace;
};

module.exports = {
    getWorkplace,
    createWorkplace,
}