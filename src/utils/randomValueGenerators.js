const randomFixedInteger = (length) => {
    const maxValue = Math.pow(10, length) - 1;
    const minValue = Math.pow(10, length - 1);
    return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
}

module.exports = {
    randomFixedInteger,
}