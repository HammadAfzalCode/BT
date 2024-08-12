const Boom = require("@hapi/boom");
const { logger } = require("../../logger");
const { dataSource } = require("../../infrastructure/postgres");


const createUser = async ({ email, first_name, last_name, password, role_id, workplace_id }, options = {}) => {

	const { queryRunner } = options;

	const userRepository = queryRunner ? queryRunner.manager.getRepository("User") : dataSource.getRepository("User");
	
	const user = userRepository.create({
		email,
		first_name,
		last_name,
		password,
		role_id,
		workplace_id
	});
	const savedUser = await userRepository.save(user);
	return savedUser;
};

const getUser = async (filter) => {
	const userRepository = dataSource.getRepository("User");
	const user = userRepository.findOne({ where: filter });
	return user;
};

const updateUserPassword = async (email, password) => {
	const userRepository = dataSource.getRepository("User");
	const userData = await getUser({ email: email })
	if (userData) {
		const updatedUserData = {
			password: password,
			updated_at: new Date(),
		};
		const updatedUser = userRepository.merge(userData, updatedUserData);
		return await userRepository.save(updatedUser);
	} else {
		throw Boom.notFound("User not found");
	}
}

module.exports = {
	createUser,
	getUser,
	updateUserPassword,
};