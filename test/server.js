process.chdir(__dirname);

var browserify = require('browserify-middleware')
var express = require('express')

var app = express()

app.configure(function(){
    app.use(express.static(__dirname))
})

app.get('/app.js', browserify('./browser.js'))

app.get('/', function(req, res){
    res.sendFile('index.html')
})

app.listen(3000)
console.log('Listening on port 3000')
