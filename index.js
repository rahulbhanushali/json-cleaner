const http = require('http');
const app = new http.Server();
const jsonHandler = require('./json-handler')
const async = require('async')

app.listen(8000, () => {
    console.log(`APP is listening on port`);
});

//kachra ends here

//magic starts here
var fs = require('fs')
    , es = require('event-stream');

fs.readdir('./issues/input', function (err, items) {

    // for (var i = 0; i < items.length; i++) {
    async.eachSeries(items, function (item, callback) {
        console.log('processing file:', item)

        jsonHandler.init(item)
        var lineNr = 0;

        var s = fs.createReadStream(`${__dirname}/issues/input/${item}`)
            .pipe(es.split())
            .pipe(es.mapSync(function (line) {

                // pause the readstream
                s.pause();

                lineNr += 1;

                // process line here and call s.resume() when rdy
                // function below was for logging memory usage
                jsonHandler.handleLine(line, () => {

                    // resume the readstream, possibly from a callback
                    s.resume();
                })
            })
                .on('error', function (err) {
                    console.log('Error while reading file.', err);
                })
                .on('end', function () {
                    console.log('Read entire file.')
                    console.log('total lines: ', lineNr)
                    jsonHandler.tearDown()
                    callback()
                })
            );


        console.log('file processed: ', item)
    })
});



