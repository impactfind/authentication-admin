require("dotenv").config()
// const
global.__root = __dirname
global.__model = require(`${__dirname}/model`)
global.__lib = (name) => { return require(`${__dirname}/lib/${name}`) }
global.__shared = (name) => { return require((`${__dirname}/shared/${name}`)) }
global.__validator = (name) => { return require(`${__dirname}/validator/${name}`) }

require(`${__dirname}/http`)
require(`${__dirname}/rpc`)

