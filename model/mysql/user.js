const moment = require("moment")
const {compare} = __lib("password")
const RandomString = require("randomstring")

module.exports = function($, DataTypes) {
    const User = $.define('user', {
        id: {
            type: DataTypes.STRING(30),
            primaryKey: true,
            validate: {
                len: [30],
                isAlphanumeric: true
            }
        },
        username: {
            type: DataTypes.STRING(30),
            notNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            notNull: false
        },
        permissions: {
            type: DataTypes.JSON,
            notNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            notNull: false
        },
        created_at: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        updated_at: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        timestamps: false,
        underscored: true,
        tableName: "user",
        indexes: [
            {
                unique: true,
                fields: ["username"]
            },
            {
                fields: ["created_at"]
            }
        ],
        hooks: {
            beforeCreate(user, options) {
                user.id = RandomString.generate({
                    length: 30,
                    charset: "0123456789abcdefghijklmnopqrstuvwxyz",
                })
                user.created_at = moment().unix()
                user.updated_at = moment().unix()
                user.status = 0
            },
            beforeUpdate(user, options) {
                user.updated_at = moment().unix()
            }
        }
    })

    User.prototype.isPasswordValid = function(pin) {
        return compare(pin, this.getDataValue("password"))
    }

    return User
}
