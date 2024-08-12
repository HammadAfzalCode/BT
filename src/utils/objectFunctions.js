const isObject = (obj) => {
    return Object.getPrototypeOf(obj) === Object.prototype;
}

const assignValueToEachObject = (array, newKey, value) => {
    return Object.keys(array).forEach(key => Object.assign(array[key], { [newKey]: value }));
}

module.exports = {
    isObject,
    assignValueToEachObject,
}