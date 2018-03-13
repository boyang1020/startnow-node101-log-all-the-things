const express = require('express');
const fs = require('fs');
const app = express();
var csv = './server/log.csv';

// write your logging code here
app.use((req, res, next) => {
    var log =  req.headers['user-agent'].replace(/,/g, "")+ ',' +
        new Date().toISOString() + ',' + 
        req.method + ',' + 
        req.path + ',' + 
       'HTTP/' + req.httpVersion + ',' + 
        res.statusCode +
        '\n';
    fs.appendFile(csv, log, (err) => {
        if (err) throw err;
        console.log(log);
        next();
      });
});

// write your code to respond "ok" here
app.get('/', (req, res) => {
    res.send('ok');
});

// write your code to return a json object containing the log data here
app.get('/logs', (req, res) => {
    var keys = ['Agent', 'Time', 'Method', 'Resource', 'Version', 'Status'];
    var obj = []
    fs.readFile(csv, 'utf8', function(err, data){
        var lines = data.split('\n');
        for (var i = 1; i < lines.length; i++) {
            if (lines[i].length < 3) continue;
            var result = {}
            var values = lines[i].split(',');
            for (var j = 0; j < keys.length; j++){
                result[keys[j]] = values[j];
            }
            obj[i-1] = result;
        }
        res.json(obj);
    })
});

module.exports = app;