const { dataSource } = require('../../infrastructure/postgres')
const { client } = require('../../infrastructure/redis')

const syncRolesAndPermissionsToCache = async () => {
    const rolesRepository = dataSource.getRepository("Role")
    const rolePermissionsRepository = dataSource.getRepository("AllowedPermission")

    const roles = await rolesRepository.find();

    for (const role of roles) {
        const permissions = await rolePermissionsRepository.find({ where: { 'role.id': role.id }, relations: ['permission'], relations: ['role'] });
        const rolePermissions = permissions.map(rp => rp.permission.name);
        await client.set(`role:${role.name}:permissions`, JSON.stringify(rolePermissions));
    }
}

module.exports = {
    syncRolesAndPermissionsToCache,
}