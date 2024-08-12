const { dataSource } = require("../../infrastructure/postgres");

const createInterimInvoice = async (invoiceData) => {
    const interimRepository = dataSource.getRepository("InterimInvoice");
    const payload = {
        ...invoiceData,
        created_at: new Date(),
        updated_at: new Date(),
    };
    const createInterimRepository = interimRepository.create(payload);
    const data = await interimRepository.save(createInterimRepository);
    return data;
};

module.exports = {
    createInterimInvoice,
}