var http = require('http');
var needle = require('needle');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var {JsonDB} = require('node-json-db');
var {Config} = require('node-json-db/dist/lib/JsonDBConfig');

var cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));


/*
app.get('/api/events', function(req,res){
    let events = [{date: '2020-05-16', name: 'today'},{date: '2020-05-17', name: 'tommorow'}];
    res.json(events);
});
*/
var db = new JsonDB(new Config("myDataBase", true, false, '/'));

app.post('/api/registration',function(req,res){
    db.push("/users/reg/"+req.body.email, req.body, true);
    res.send('Reg succsesful');
});

app.post('/api/login',function(req,res){
    var data = db.getData("/users/reg/"+req.body.email);
    if (data.password == req.body.password){
        var key = String(Math.round(Math.random()*100000000))+String(Math.round(Math.random()*100000000))+String(Math.round(Math.random()*100000000))+String(Math.round(Math.random()*100000000))+String(Math.round(Math.random()*100000000));
        db.push("/users/log/"+req.body.email, key, true);
        res.send(key);
    }
    else{
        res.send('Incorect password');
    }
});





app.get('/api/getI',function(req,res){
    var data = req.headers.cookie;
    //data = data.split(';');
    //data = JSON.parse(String(data));
    //console.log(data);
    res.send(data);
});






/*
needle.get('https://events.educom.ru/calendar',function(err,res){
    if (err) throw err;

    let $ = cheerio.load(res.body);

    fs.writeFileSync('data.txt',$('div.calendar-page__events-cards.grid-x.align-justify section.event-card.small-12.grid-x:nth-child(5) div.event-card__content-description-info-more.small-12.medium-5.align-self-bottom a').attr('href'));
});
*/

app.listen(3000, function(){
    console.log('Express server listening on port 3000');
});

/*
var server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    res.end("Hello Word!");
});

server.listen(3000, '127.0.0.1');
console.log("Мы отслеживаем порт 3000");
*/


