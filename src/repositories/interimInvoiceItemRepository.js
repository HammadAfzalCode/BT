const { dataSource } = require("../../infrastructure/postgres");

const bulkInsertInterimInvoiceItems = async (invoiceItems) => {
    const invoiceItemsRepository = dataSource.getRepository("InterimInvoiceItem");
    const createInvoiceItem = invoiceItemsRepository.create(invoiceItems);
    const invoiceItem = await invoiceItemsRepository.save(createInvoiceItem);
    return invoiceItem;
};

module.exports = {
    bulkInsertInterimInvoiceItems
}