const Promise = require("bluebird")
const TAG = "active_session_admin"

const getActiveSession = function($) {
    const get = Promise.promisify($.get).bind($)

    return ({id}) => {
        return get(`${TAG}_${id}`)
            .then((data) => data.split(","))
            .catch(() => false)
    }
}

const setActiveSession = function($) {
    return (({id, permissions}) => {
        $.set(`${TAG}_${id}`, permissions.join(","))
    })
}

const removeActiveSession = function($) {
    const del = Promise.promisify($.del).bind($)
    return (({id}) => {
        return del(`${TAG}_${id}`)
    })
}

module.exports = function($redis) {
    return {
        isActiveSession: getActiveSession($redis),
        activeSession: setActiveSession($redis),
        removeActiveSession: removeActiveSession($redis)
    }
}

