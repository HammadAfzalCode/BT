const { logger } = require("../../logger");
const { createBackOffice } = require("../services/backOfficeService");

const createBackOfficeCont = async (request, response) => {
    logger.info("data: ", request.body);
    try {
        const warehouse = await createBackOffice(request.body);
        response.code(200).send({
            status: true,
            message: "success",
            data: warehouse,
        });
    } catch (error) {
        response.code(400).send({
            status: false,
            message: error.message,
        });
    }
};

module.exports = {
	createBackOfficeCont,
};