const Boom = require('@hapi/boom')
const { verifyAccessToken } = require('../helpers/jwtHelper')
const { client } = require('../../infrastructure/redis')
const { getRole } = require('../repositories/rolesRepository')
const { getRolePermissions } = require('../repositories/rolePermissionRepository')

const userAuthentication = async (request, response) => {
    try {
        if (!request.headers['authorization']) throw Error('Unauthorized User!')
        const token = request.headers['authorization'].split(' ')[1]
        const user = verifyAccessToken(token)
        request.user = user
    } catch (error) {
        throw Boom.unauthorized(error.message)
    }
}

const userAuthorization = async (request, response, requiredPermission) => {
    
    const { role } = request.user
    const redisKey = `role:${role}:permissions`
    const result = await client.get(redisKey)

    if (!result) throw Boom.forbidden('Role not found')

    const permissions = JSON.parse(result)

    if (permissions.includes(requiredPermission)) return

    const rolePermissions = await checkPermissionInDb(role)

    if (!rolePermissions.includes(requiredPermission)) throw Boom.forbidden('Forbidden: You do not have the required permission')

    await client.set(`role:${role}:permissions`, JSON.stringify(rolePermissions))
    return
}

const checkPermissionInDb = async (roleName) => {
    const dbRole = await getRole({ name: roleName })
    const newRolePermissions = await getRolePermissions({ role_id: dbRole.id })
    const rolePermissions = newRolePermissions.map(rp => rp.permission.name)
    return rolePermissions
}

const checkPermission = (requiredPermission) => {
    return async (request, response) => {
        await userAuthorization(request, response, requiredPermission)
    }
}

module.exports = {
    userAuthentication,
    userAuthorization,
    checkPermission,
}