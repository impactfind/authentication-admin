const Promise = require("bluebird")
const crypto = require("crypto")
const rstring = require("randomstring")

const encodePassword = Promise.promisify(crypto.pbkdf2).bind(crypto)

const encodeSalt = function(salt, systemSalt) {
    return crypto.createHmac("sha256", systemSalt)
        .update(salt)
        .digest("hex")
}

const getIteration = function(salt) {
    let number = ""
    for(let i = salt.length - 1; i >= 0; --i) {
        const ord = salt.charCodeAt(i)
        if(ord >= 48 && ord <= 57) {
            number = number + salt.charAt(i)
        }
    }

    console.log("SALT: ", salt)
    console.log("NUMBER-ALL: ", number)
    if(number.length === 0) {
        number = '0'
    }
    else if(number.length > 32) {
        number = number.substr(17, 5)
    }
    else if(number.length > 16) {
        number = number.substr(11, 5)
    }
    else if(number.length > 8) {
        number = number.substr(3, 5)
    }
    else if(number.length > 4) {
        number = number.substr(0, 4)
    }

    console.log("NUMBER: ", number)
    number = parseInt(number)

    return parseInt(process.env.ITERATION) + number
}

const encode = function(password, salt) {
    if(salt === undefined) {
        salt = rstring.generate({
            length: 35,
            charset: "alphanumeric"
        })
    }
    const SYSTEM_SALT = process.env.SALT
    const encryptedSalt = encodeSalt(salt, SYSTEM_SALT)
    const iteration = getIteration(encryptedSalt)

    return encodePassword(password, encryptedSalt, iteration, 32, "sha256")
        .then((cipher) => {
            return `${cipher.toString("hex")}.${salt}`
        })
}

const compare = function(password, cipher) {
    const [cpass, csalt] = cipher.split(".")

    return encode(password, csalt)
        .then((inputCipher) => {
            return inputCipher === cipher
        })
}

module.exports = {encode, compare}