const path = require('path');
const { DataSource } = require('typeorm');
const config = require('../src/globals/config')
const { PinoLogger, logger } = require('../logger');

logger.info("Initializing PGSQL Adapter >");
const dbConfig = config.get("database").pgsql;
const synchronize = config.get("environment") !== "development"

const dataSource = new DataSource({
	type: dbConfig.dialect,
	host: dbConfig.host,
	port: dbConfig.port,
	username: dbConfig.username,
	password: dbConfig.password,
	database: dbConfig.database,
	synchronize: synchronize,
	logging: true,
	logger: new PinoLogger,
	entities: [path.join(__dirname, '../src/entities/**/*.js')],
	migrations: [ path.join(__dirname, '../migrations/**/*.js')],
});

const dbInitialize = async () => {
	try {
		await dataSource.initialize()
		logger.info("Connection has been established successfully.");
	} catch (_error) {
		logger.error("Unable to connect to the database: ", _error);
		throw _error;
	}
}

logger.info("[\u2713] Postgres [ready]");

module.exports = { dataSource, dbInitialize }
