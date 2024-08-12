const bcrypt = require('bcrypt');
const config = require('../globals/config')

const createHashValue = async (plainText) => {
    const saltRounds = config.get("hash").salt_rounds;
    const hash = await bcrypt.hash(plainText, saltRounds);
    return hash;
}

const compareHash = async (plainText, hash) => {
    const result = await bcrypt.compare(plainText, hash);
    return result;
}

module.exports = {
    createHashValue,
    compareHash,
}