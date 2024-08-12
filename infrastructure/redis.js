const IORedis = require('ioredis');
const config = require('../src/globals/config')
const { PinoLogger, logger } = require('../logger');

const dbConfig = config.get('cache').redis;

const client = new IORedis(dbConfig.port, dbConfig.host);

const cacheInitialize = () => {
    client
        .on('ready', () => {
            logger.info('[\u2713] REDIS_EVENT [ready]');
        })
        .on('error', (err) => {
            logger.error(`REDIS_EVENT [error] ${err.message}`);
        })
        .on('end', () => {
            logger.info('REDIS_EVENT [disconnect]');
        });
}

module.exports = { client, cacheInitialize };
