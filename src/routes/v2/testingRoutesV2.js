module.exports = async (fastify, options) => {

    fastify.route({
        method: 'GET',
        url: '/test',
        handler: (req, res) => {
            res.send({ message: "Hello World. Version 2 !" })
        }
    })
};