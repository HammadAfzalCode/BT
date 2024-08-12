const { dataSource } = require("../../infrastructure/postgres")

const getRolePermissions = async (filter) => {
    const rolePermissionsRepository = dataSource.getRepository("AllowedPermission")
    const rolePermissions = rolePermissionsRepository.find({ where: filter, relations: ['permission', 'role'] })
    return rolePermissions
}

const getPermissionsArray = async (roleId) => {

    const permissionsObj = await dataSource.getRepository("AllowedPermission")
        .createQueryBuilder('allowed_permission')
        .select('ARRAY_AGG(permission.name)', 'permissions')
        .innerJoin('allowed_permission.permission', 'permission')
        .innerJoin('allowed_permission.role', 'role')
        .where('role.id = :roleId', { roleId })
        .groupBy('role.id')
        .getRawOne();

    return permissionsObj.permissions;
}

module.exports = {
    getRolePermissions,
    getPermissionsArray,
}