/* eslint-disable array-callback-return */
const _ = require('lodash')
const fp = require('fastify-plugin');

const responseDecorator = (fastify, opts, next) => {

    fastify.addHook('preSerialization', async function preSerialization(request, response, payload) {

        fastify.log.trace('request.body > ', { reqId: request.raw.id, body: request.body });
        fastify.log.trace('response.body >', { reqId: request.raw.id, payload });

        const _code = _.get(response, 'raw.statusCode', 200);
        const _message = _.get(payload, 'message', 'Success');
        const _payload = Object.assign(payload, { code: _code, message: _message });

        if(payload.swagger) {
            return payload;
        }
        return _payload
    });

    next();
};

module.exports = fp(responseDecorator, {
    name: 'responseDecorator',
    fastify: '4.x',
});
