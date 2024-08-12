const { dataSource } = require("../../infrastructure/postgres")

const getRole = async (filter) => {
    const rolesRepository = dataSource.getRepository("Role")
    const role = rolesRepository.findOne({ where: filter })
    return role
}

module.exports = {
    getRole,
}