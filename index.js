var http = require('http');
var needle = require('needle');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
//var cheerio = require('cheerio');

var cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));



app.get('/api/events', function(req,res){
    let events = [{date: '2020-05-16', name: 'today'},{date: '2020-05-17', name: 'tommorow'}];
    res.json(events);
});

app.post('/api/registration',function(req,res){
    console.log(req.body);
    let a = req.body;
    console.log(a.username,a.password);
    res.send('OK')
})




app.listen(3000, function(){
    console.log('Express server listening on port 1337');
});

/*
var server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    res.end("Hello Word!");
});

server.listen(3000, '127.0.0.1');
console.log("Мы отслеживаем порт 3000");
*/


