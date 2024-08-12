module.exports = async (fastify, opts) => {
    fastify.route({
        method: 'POST',
        url: '/test',
        handler: (req, res) => {
            res.send({ message: "Hello World. Version 1 !" })
        }
    });
};
