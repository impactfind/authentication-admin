require("dotenv").config()

const fn = process.argv[2]
const param = JSON.parse(process.argv[3])

const Client = require(`${__dirname}/../lib/rpc_broker/client`)
const AuthClient = new Client("tcp://127.0.0.1:10310", "authentication")

console.log("fn: ", fn, " param: ", param)
AuthClient.invoke(fn, param)
    .then((result) => {
        console.log("RESULT: ", result)
        process.exit(0)
    })
