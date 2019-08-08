const moment = require("moment")
const {compare} = __lib("password")

module.exports = function($, DataTypes) {
    const Permissions = $.define('permissions', {
        id: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        value: {
            type: DataTypes.STRING(50),
            notNull: false
        },
    }, {
        timestamps: false,
        underscored: true,
        tableName: "permissions",
    })

    Permissions.sync({force: true})
        .then(() => Permissions.bulkCreate([
            {id: "ADMIN", value: "Super Admin"},
            {id: "Member", value: "Member"},
        ]))
        .catch((err) => {
            console.log("ERROR-PERMISSIONS-INIT: ", err)
        })

    return Permissions
}
