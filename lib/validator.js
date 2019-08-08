const Promise = require("bluebird")
const Scheme = require("async-validator")

module.exports.integer = function(opt) {
    return (rule, value, cb) => {
        const {min, max, message, required} = opt

        if(value === undefined && !required) {
            return cb([])
        }
        if(isNaN(value) || parseInt(value, 10) != value) {
            return cb([new Error(message || "Integer Error")])
        }
        const v = parseInt(value, 10)
        if(min !== undefined && v < min) {
            return cb([new Error(message || "Integer Error value < " + min)])
        }
        if(max !== undefined && v > max) {
            return cb([new Error(message || "Integer Error value > " + max)])
        }
        return cb([])
    }
}

module.exports.float = function(opt) {
    return (rule, value, cb) => {
        const {min, max, message, required} = opt

        if(value === undefined && !required) {
            return cb([])
        }
        if(isNaN(value)) {
            return cb([new Error(message || "Float Error")])
        }
        const v = parseFloat(value)
        if(min !== undefined && v < min) {
            return cb([new Error(message || "Float Error value < " + min)])
        }
        if(max !== undefined && v > max) {
            return cb([new Error(message || "Float Error value > " + max)])
        }
        return cb([])
    }
}

module.exports.validate = function(descriptor_name) {
    const validatorList = {}
    const valDescriptor = __validator(descriptor_name)

    return (type, param) => {
        const validate = validatorList[type] ||
            (() => {
            const Validator = new Scheme(valDescriptor[type])
            return validatorList[type] = Promise.promisify(Validator.validate).bind(Validator)
        })()

        return validate(param, {first: true}).catch((err) => {
            throw new Error(err[0].message)
        })
    }
}
