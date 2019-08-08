const PermissionsModel = __model.mysql("permissions")

const getList = module.exports.getList = function() {
    return PermissionsModel.findAll({raw: true})
}




