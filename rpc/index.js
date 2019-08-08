const Service = require("qgrail-broker").Service;
const AuthenticationService = new Service(process.env.SERVICE_HOST)

const User = require(__dirname + "/user")
AuthenticationService.func("user/verify", User.verify);
AuthenticationService.func("user/login", User.login);

process.on("SIGINT", () => process.exit(0));

AuthenticationService.listen()

