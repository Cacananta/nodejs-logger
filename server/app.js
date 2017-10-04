const express = require('express');
const fs = require('fs');
const app = express();
const date = new Date();

app.use((req, res, next) => {

  var csvOutput = req.get('user-agent') + ',' + date.toISOString() + ',' + req.method + ',' + req.path + ',' + 'HTTP/' + req.httpVersion + ',' + res.statusCode + '\n';
  fs.appendFile(__dirname + '/log.csv', csvOutput, (err) => {    //<= this is a working append function! 
    if (err) throw err;
  })
  console.log(csvOutput);
  next();
  // 'Agent,Time,Method,Resource,Version,Status' + '\n' + 

  // console.log(req.get('user-agent')); //<= Agent
  // console.log(date.toISOString()); //<= Time
  // console.log(req.method);// <= Method
  // console.log(req.path); // <= Resource
  // console.log('HTTP/' + req.httpVersion);// <= Version
  // console.log(res.statusCode);// <= Status

});

app.get('/', (req, res) => {
  res.send('OK');
});


app.get('/logs', (req, res) => {
  var data = fs.readFileSync(__dirname + '/log.csv');
  data = data.toString();

  //convert csv to JSON
  var lines = data.split("\n");
  var result = [];
  var headers = lines[0].split(",");
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  res.send(result);
});

module.exports = app;














//NOTES:

//expose an endpoint => point it to a path like 'app.get('/blah', function () {} )' so app.use knows to stop running (?)

///CODE GRAVEYARD:

// return next() <-- stops function and moves it past  specific information you want to bypass and onto the next 
//info in the same type (i.e. if you are on a GET 'return next()' will move to next GET, but will not move to
//an app.PUSH since it is a different piece of information)

//body parser changes the data from above to a useable format

//JSON.parse(body) <--needs the JSON.parse middleware to change the format to JSON type from whatever type it is in.

    //  console.log(req.protocol); <= returns 'http'
 //res.format(object); <= Check the API for this. May help formatting in project.