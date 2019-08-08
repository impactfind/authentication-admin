module.exports.create = {
    username: [
        {type: "string", required: true, message: "username harus diisi"}
    ],
    password: [
        {type: "string", required: true, message: "password harus diisi"}
    ],
};

module.exports.detail = {
    id: [
        {type: "string", required: true, message: "id harus diisi"}
    ]
}

module.exports.update = {
    id: [
        {type: "string", required: true, message: "id harus diisi"}
    ],
    password: [
        {type: "string", min: 6, message: "password harus minimal 6 karakter"}
    ],
}

module.exports.remove = {
    id: [
        {type: "string", required: true, message: "id harus diisi"}
    ]
}

module.exports.changePassword = {
    id: [
        {type: "string", required: true, message: "id harus diisi"}
    ],
    old_password: [
        {type: "string", required: true, message: "password lama harus diisi"}
    ],
    password: [
        {type: "string", required: true, message: "password harus diisi"}
    ]
}

module.exports.login = {
    username: [
        {type: "string", required: true, message: "username harus diisi"}
    ],
    password: [
        {type: "string", required: true, message: "password harus diisi"}
    ]
}

module.exports.verify = {
    token: [
        {type: "string", required: true, message: "jwt_token harus diisi"}
    ]
}



