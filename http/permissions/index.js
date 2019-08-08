const permissions = require("express").Router()
const Permissions = require(`${__dirname}/detail`)

permissions.get("/", Permissions.getList)

module.exports = permissions