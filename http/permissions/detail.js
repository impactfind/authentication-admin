const shared = __shared("permissions")

module.exports.getList = function(req, res) {
    return shared.getList()
        .then((permissions) => res.success({
            payload: {
                permissions
            }
        }))
        .catch(res.error)
}



