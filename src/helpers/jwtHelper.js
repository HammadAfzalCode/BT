const jwt = require('jsonwebtoken')
const config = require('../globals/config')

const signAccessToken = (payload, expiresIn = '24h') => {
    const secrect = config.get('jwt').secret
    const options = {
        expiresIn: expiresIn
    }

    const token = jwt.sign(payload, secrect, options)
    return token
}

const verifyAccessToken = (token) => {
    const secrect = config.get('jwt').secret
    const decodedPayload = jwt.verify(token, secrect)
    return decodedPayload
}

module.exports = {
    signAccessToken,
    verifyAccessToken,
}