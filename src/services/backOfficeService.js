const { create } = require("../repositories/backOfficeRepository");

const createBackOffice = async (backOfficeData) => {
	const createdBackOffice = await create(backOfficeData);
	return createdBackOffice;
};

module.exports = {
	createBackOffice,
};