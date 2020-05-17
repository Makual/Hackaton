var http = require('http');
var needle = require('needle');
var fs = require('fs');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');

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

app.post('/api/registration',function(req,res){
    console.log(req.body);
    res.send('Reg succsesful');
})

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


