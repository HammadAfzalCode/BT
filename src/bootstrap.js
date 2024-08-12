const FastServer = require('./globals/_server');

module.exports = async (process) => {
    let server = null;

    try {
        server = await FastServer({ process });
        await server.start();
    } catch (_error) {
        console.error("Fatal Error In Bootstrap > ", _error);
        process.exit(1);
    }

    process.on('SIGINT', async () => {
        console.log('Stopping server >');

        await server.fastifyServer.close();

        console.log('Server has stopped >');

        process.exit(0);
    });

    return {
        server: server.fastifyServer,
    }
};