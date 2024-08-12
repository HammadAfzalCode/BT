const Boom = require("@hapi/boom");

const dateAfterNDays = (numberOfdays) => {
    if (typeof numberOfdays !== 'number') throw Boom.badData('The paramter should be of type integer')
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + numberOfdays);
    const formattedFutureDate = futureDate.toISOString().split('T')[0];
    return formattedFutureDate;
}

module.exports = {
    dateAfterNDays,
}