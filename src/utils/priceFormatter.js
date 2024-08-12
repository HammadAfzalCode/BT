const totalCalculator = (unitPrice, quantity) => {
    const total = parseFloat(unitPrice.replace('$', '')) * quantity;
    return `$${total.toFixed(2)}`;
}

const moneyValueAddition = (previousPrice, priceToAdd ) => {
    const total = parseFloat(previousPrice.replace('$', '')) + parseFloat(priceToAdd.replace('$', ''));
    return `$${total.toFixed(2)}`;
}

module.exports = {
    totalCalculator,
    moneyValueAddition
}