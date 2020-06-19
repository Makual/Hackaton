var needle = require('needle');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var {JsonDB} = require('node-json-db');
var {Config} = require('node-json-db/dist/lib/JsonDBConfig');
var cors = require('cors');
const fetch = require('node-fetch');
var servLib = require('./servLib')
//const nodemailer = require('nodemailer');


app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

var db = new JsonDB(new Config("Calendare", true, false, '/')); 


app.post('/api2/testData',function(req,res){
    console.log(servLib.testAllData(req.body.data))
    res.send(servLib.testAllData(req.body.data))
});

app.post('/api2/uploadData',function(req,res){
    db.push('/allData',req.body.data)
    res.send('OK')
});

app.get('/api2/getGroupData',function(req,res){
    res.send(servLib.findAllGroups(db.getData('/allData')))
});

app.get('/api2/getTeacherData',function(req,res){
    res.send(servLib.findAllTeachers(db.getData('/allData')))
});

app.get('/api2/getClassroomData',function(req,res){
    res.send(servLib.findAllClassrooms(db.getData('/allData')))
});

app.post('/api2/getTeacher',function(req,res){
    dat = servLib.findTeacher(db.getData('/allData'),req.body.teacher);
    dat = servLib.addAllTime(db.getData('/allData'),dat)
    res.send(dat)
});

app.post('/api2/getGroup',function(req,res){
    res.send(servLib.findGroup(db.getData('/allData'),req.body.group))
});

app.post('/api2/getClassroom',function(req,res){
    dat = servLib.findClassroom(db.getData('/allData'),String(req.body.classroom))
    dat = servLib.addAllTime(db.getData('/allData'),dat)
    res.send(dat)
});



app.listen(3001, function(){
    console.log('Express server listening on port 3001');
});