const CodeError = function(message, code) {
    this.message = message
    this.code = code

}

CodeError.prototype = new Error()

module.exports = CodeError
