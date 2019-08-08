
const Client = require("qgrail-broker").Client;
const AuthClient = new Client(process.env.BROKER_HOST, "authentication")

const getAuthorizationToken = function(header) {
    if(header === undefined || !header.startsWith("Bearer ")) {
        return false
    }

    return header.substr("Bearer ".length)
}

const throwAuthorizationError = function(res) {
    res.error({
        code: 401,
        message: "Token tidak valid",
        payload: {
        }
    })
}
const getPermissions = function(rule) {
    const [type, pstring] = rule.split("-")
    return pstring.split(",")
}

module.exports = function (permission) {
    return (req, res, next) => {
        console.log('ini header', req.headers);
        const token = getAuthorizationToken(req.get("Authorization"))
        if(token === false) {
            return throwAuthorizationError(res)
        }
        console.log('ini token', token)
        AuthClient.invoke("user/verify", {
            token,
            permission
        })
          .then((result)=> {
              if (result.name!=='Error') {
                  req.token = result;
                  next()
              }
              else {
                  res.error(result)
              }

          })
    }
}





