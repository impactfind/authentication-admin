const Express = require("express");
const BodyParser = require("body-parser");
const cors = require("cors");

const http = Express();
const port = process.env.HTTP_PORT || 3000;

http.use(cors({
    origin: true
}))

http.use((req, res, next) => {
    res.success = ({message, payload}) => {
        res.status(200).json({
            code: 200,
            message: message || "",
            payload: payload || {}
        })
    }

    res.error = (error) => {
        const errCode = error.code || 400
        res.status(errCode).json({
            code: errCode,
            message: error.message || error || "Oops, something wrong",
            payload: error.payload || {}
        })
    }

    next()
})
http.use(BodyParser.json())

http.use("/permissions", require(`${__dirname}/permissions`))
http.use("/admin", require(`${__dirname}/user`))

http.use((err, req, res, next) => {
    console.log("UNEXPECTED-ERROR: ", err.stack)
    res.error({code: 500, message: "Ooops, something wrong, please contact administrator"})
})

http.listen(port, () => {
    console.log("Profiles service run on port " + port)
})

