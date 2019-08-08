const shared = __shared("user")
const Validate = __lib("validator").validate("user")

const _ = require("ramda")
const pickby = _.pick(["id", "username", "permissions", "created_at", "updated_at"])

module.exports.list = function(req, res) {
    return shared.list()
        .then((payload) => res.success({payload}))
        .catch(res.error)
}

module.exports.detail = function(req, res) {
    const params = req.params

    return Validate("detail", params)
        .then(() => shared.detail(params))
        .then((user) => res.success({
            payload: pickby(user)
        }))
        .catch(res.error)
}

module.exports.update = function(req, res) {
    const params = req.body
    params.id = req.params.id

    return Validate("update", params)
        .then(() => shared.update(params))
        .then((user) => res.success({
            message: "Admin telah berhasil diupdate",
            payload: pickby(user)
        }))
        .catch(res.error)
}

module.exports.remove = function(req, res) {
    const params = req.params

    return Validate("remove", params)
        .then(() => shared.remove(params))
        .then((user) => res.success({
            message: "Admin telah berhasil dihapus",
            payload: pickby(user)
        }))
        .catch((err) => {
            console.log("ERROR: ", err)
            res.error(err)
        })
}

module.exports.changePassword = function(req, res) {
  const params = req.body
  params.id = req.token.id
  return Validate("changePassword", params)
    .then(() => shared.changePassword(params))
    .then(() => res.success({
      message: "Password telah diubah"
    }))
    .catch(err=> res.error(err))
}

module.exports.login = function(req, res) {
    const params = req.body

    return Validate("login", params)
        .then(() => shared.login(params))
        .then((token) => res.success({
            payload: {
                token
            }
        }))
        .catch(res.error)
}

module.exports.create = function(req, res) {
  let params = req.body
  params.permissions = ["ADMIN"];
  return Validate("create", params)
    .then(() => shared.create(params))
    .then((payload) => res.success({
      message: "Admin berhasil dibuat",
      payload: pickby(payload)
    }))
    .catch((err)=> {
      console.log('err',err)
      res.error(err)
    })
}
