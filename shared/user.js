const Promise = require("bluebird")
const jwt = require("jsonwebtoken")
const UserModel = __model.mysql("user")
// const UserRedisModel = __model.redis("user")
const CodeError = __lib("code_error")
const {compare, encode} = __lib("password")

const PermissionsShared = __shared("permissions")

const jwtSign = Promise.promisify(jwt.sign).bind(jwt)
const jwtVerify = Promise.promisify(jwt.verify).bind(jwt)

const attributes = [
    "id", "username", "permissions"
]

const list = module.exports.list = function() {
  console.log('ini usermodel', UserModel.findAll())
    return UserModel.findAll({
            attributes,
            where: {status: 0},
            order: [["created_at", "desc"]]
        })
}

const signAdmin = function({id, permissions}) {
    return jwtSign({id, permissions}, process.env.JWT_TOKEN, {algorithm: "HS512"})
}



const checkPermissionsValidity = function(list, data) {
    const map = {}
    list.forEach((p) => {
        map[p.id] = true
    })

    return data.filter((d) => map[d] === undefined).length === 0
}

const create = module.exports.create = function({username, password, permissions}) {
    return PermissionsShared.getList()
        .then((permission_list) => {
            const is_permission_valid = checkPermissionsValidity(permission_list, permissions)
            if(!is_permission_valid) {
                throw new CodeError("Beberapa permission tidak valid", 400)
            }

            return encode(password)
        })
        .then((cipher_password) => UserModel.create({
            username, password: cipher_password, permissions
        }))
}

const detail = module.exports.detail = function({id}) {
    return UserModel.findOne({
            where: {id}
        })
        .then((admin) => {
            if(admin === null) {
                throw new CodeError("User tidak ditemukan", 404)
            }

            return admin
        })
}

const update = module.exports.update = function({id, password, permissions}) {
    return detail({id})
        .then((admin) => Promise.all([
            Promise.resolve(admin),
            Promise.resolve((password && encode(password) || admin.password)),
            PermissionsShared.getList()
        ]))
        .spread((admin, cipher_password, permission_list) => {
            const is_permission_valid = checkPermissionsValidity(permission_list, permissions)

            if(!is_permission_valid) {
                throw new CodeError("Beberapa permission tidak valid", 400)
            }

            admin.password = cipher_password
            admin.permissions = permissions

            return admin.save()
        })
}

const remove = module.exports.remove = function({id}) {
    return detail({id})
        .then((admin) => {
            admin.status = 1

            return admin.save()
        })
}

const changePassword = module.exports.changePassword = function({id, old_password, password}) {
    return detail({id})
        .then((admin) => Promise.all([
            compare(old_password, admin.password),
            Promise.resolve(admin)
        ]))
        .spread((is_valid, admin) => {
            if(!is_valid) {
                throw new CodeError("Password lama tidak valid", 401)
            }

            return Promise.all([
                Promise.resolve(admin),
                encode(password)
            ])
        })
        .spread((admin, cipher) => {
            admin.password = cipher

            return admin.save()
        })
}

const detailWithUsername = function({username}) {
    return UserModel.findOne({
            where: {username: username, status: 0}
        })
        .then((admin) => {
            if(admin === null) {
                throw new CodeError("Username atau Password salah", 401)
            }

            return admin
        })
}

const login = module.exports.login = function({username, password}) {
    return detailWithUsername({username})
        .then((user) => Promise.all([
            compare(password, user.password),
            Promise.resolve(user)
        ]))
        .spread((is_valid, admin) => {
            if(!is_valid) {
                throw new CodeError("Username atau Password salah", 401)
            }

            // UserRedisModel.activeSession({id: admin.id, permissions: admin.permissions})

            return signAdmin(admin)
        })
}

const loginRPC = module.exports.loginRPC = function({username, password}) {
  return detailWithUsername({username})
    .then((user) => Promise.all([
      compare(password, user.password),
      Promise.resolve(user)
    ]))
    .spread((is_valid, admin) => {
      if(!is_valid) {
        return false
      }

      // UserRedisModel.activeSession({id: admin.id, permissions: admin.permissions})

      return signAdmin(admin)
    })
}
const parsedPermission = (permissions) => {
  let list = []
  permissions.map(p=> list.push(p.id))
  return list
}
const verify = module.exports.verify = function({token, permission}) {
    return verifyUser({token})
      .then((user)=> {
        if (permission=="ALL") {
          return PermissionsShared.getList()
            .then((permissions)=> {

              let listPermissions = parsedPermission(permissions);

              const valid_permission = user.permissions.some(r=> listPermissions.includes(r));
              console.log('pakahah disini', valid_permission)
              if(!valid_permission) {
                throw new CodeError("Permission anda tidak valid", 401)
              }
              return user
            })
            .catch(err=> {
              return err.message
            })
        }
        else {
          return validasiPermission(user, permission)
        }

      })
      .catch(err=> {
        return err
      })
}
const validasiPermission = (user, permission) => {
  console.log('masuk sini gak validasiPermission', permission);
  const valid = user.permissions.find(e=> {
    return e==permission
  })
  if (valid) {
    return user
  }
  else {
    console.log('masa dinsin sih')
    throw new CodeError("Anda tidak memiliki permission untuk melakukan aksi ini", 401)
  }
}

const verifyUser = function({token}) {
  return jwtVerify(token, process.env.JWT_TOKEN, {algorithms: ["HS512"]})
    .catch(() => {
      throw new CodeError("Token tidak valid", 401)
    })
}


