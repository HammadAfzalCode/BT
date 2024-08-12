/* eslint-disable array-callback-return */

const _ = require('lodash');
const Boom = require('@hapi/boom');
const fp = require('fastify-plugin');


const errorDecorator = (fastify, opts, next) => {

    fastify.setErrorHandler(function (error, request, response) {

        // if "joi" error object
        if (error && error.isJoi) {
            error = Boom.badRequest(error.message, error.details);
        }

        // if "boom" error object
        if (error && error.isBoom) {
            const _code = _.get(error, 'output.statusCode', 500);
            const _payload = Object.assign(error.output.payload, { data: error.data }, { message: error.message });

            // change "statusCode" to "code"
            _.set(_payload, 'code', _code);
            _.unset(_payload, 'statusCode');

            // remove "data" if "null"
            if (_.isNull(_payload.data))
                _.unset(_payload, 'data');

            // respond
            response
                .code(_code)
                .type('application/json')
                .headers(error.output.headers)
                .send(_payload);

            return;
        }

        response.send(error || new Boom('Got non-error: ' + error));

    });

    next();
};

module.exports = fp(errorDecorator, {
    name: 'errorDecorator',
    fastify: '4.x',
});
