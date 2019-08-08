const Sequelize = require("sequelize")

const $mysql = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST || "localhost",
    port: (process.env.DB_PORT && parseInt(process.env.DB_PORT)) || 3000,
    dialect: 'mysql',
    pool: {
        max: (process.env.DB_PORT && parseInt(process.env.DB_CON_MAX)) || 30,
        min: (process.env.DB_PORT && parseInt(process.env.DB_CON_MIN)) || 0,
        acquire: (process.env.DB_PORT && parseInt(process.env.DB_CON_TIMEOUT)) || 30000,
        idle: (process.env.DB_PORT && parseInt(process.env.DB_CON_ALIVE)) || 10000
    }
})

const _Mysql_Model_Cache_ = {}

const loadMysqlModel = function(name) {
    if(name === undefined) {
        return $mysql
    }
    if(_Mysql_Model_Cache_[name]) {
        return _Mysql_Model_Cache_[name]
    }
    _Mysql_Model_Cache_[name] = $mysql.import(`${__dirname}/mysql/${name}`)
    _Mysql_Model_Cache_[name].sync()
    return _Mysql_Model_Cache_[name]
}
//
// const $redis = require("redis").createClient({
//     host: process.env.REDIS_HOST || "127.0.0.1",
//     port: process.env.REDIS_PORT || 6379,
//     no_ready_check: true,
//     password: process.env.REDIS_PASS || undefined
// })
//
// const loadRedisModel = function(name) {
//     return require(`${__dirname}/redis/${name}`)($redis)
// }


module.exports = {
    mysql: loadMysqlModel,
    // redis: loadRedisModel
}


