const fs = require('fs')

const JsonHandler = {}
var errorFileStream, outFileStream

JsonHandler.init = function (fileName) {

    errorFileStream = fs.createWriteStream(`${__dirname}/issues/errors/${fileName}-error`)
    errorFileStream.once('open', function () {
        console.log("error file opened for writing")
    })


    outFileStream = fs.createWriteStream(`${__dirname}/issues/output/${fileName}-success`)

    outFileStream.once('open', function () {
        console.log("Out file opened for writing")
    })

}

JsonHandler.handleLine = function (line, callback) {
    if (line != '') {
        try {
            JSON.parse(line)
            this.writeToFile(line)
        } catch (error) {
            console.log('error', error)
            this.logError(line)
        }
    }

    callback()
}

JsonHandler.writeToFile = function (line) {
    outFileStream.write(line)
    outFileStream.write('\n')
}

JsonHandler.logError = function (errLine) {
    errorFileStream.write(errLine)
    errorFileStream.write('\n')
}

JsonHandler.tearDown = function () {
    errorFileStream.end()
    outFileStream.end()
}

module.exports = JsonHandler