//var http = require('http');
var needle = require('needle');
//var fs = require('fs');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var {JsonDB} = require('node-json-db');
var {Config} = require('node-json-db/dist/lib/JsonDBConfig');
var cors = require('cors');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({ //Создание почтового бота
    service: 'gmail',
    auth: {
        user: 'noreplyprofevents@gmail.com',
        pass: 'QETUOADGJLZCBM13579*'
    }
})



app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

function deleteRep(arr) { // Функция удаления дубликатов объектов
    var newArr = [];
    counter = 0;
    for (var i in arr){
        for (var i2 in newArr){
            if ((newArr[i2].name === arr[i].name) && (newArr[i2].date === arr[i].date) && (newArr[i2].time === arr[i].time)){
                counter ++;
            }
        }
        
        if (counter == 0){
            newArr.push(arr[i])
        }
        counter = 0;
    }
    return newArr;
}
function deleteRepArr(arr) {//Функция удаления дубликатов в массиве
    var newArr = [];
    counter = 0;
    for (var i in arr){
        for (var i2 in newArr){
            if ((newArr[i2] === arr[i])){
                counter ++;
            }
        }
        
        if (counter == 0){
            newArr.push(arr[i])
        }
        counter = 0;
    }
    return newArr;
}


var db = new JsonDB(new Config("userData", true, false, '/')); //Создание базы данных
var db2 = new JsonDB(new Config("parseData", true, false, '/'));



app.post('/api/registration',function(req,res){ //Получение данных с регистрации
    result = {checkedEvents: [],friends: [],statNumber: -1}
    result = Object.assign(result,req.body);
    all = db.getData('/users/reg');


    if (all[req.body.email] == undefined){
        db.push("/users/reg/"+req.body.email, result, true);
        res.send('Reg succsesful');
    }
    else{
        res.send('Reg Fail');
    }
});

app.post('/api/login',function(req,res){ //Получение данных с логина и отправка обратно SessionID
    var data = db.getData("/users/reg/"+req.body.email);
    if (data.password == req.body.password){
        res.send('Correct password');
    }
    else{
        res.send('Incorect password');
    }
});

app.get('/api/getAllEvents',function(req,res){ //Отдача всех мероприятий
    it = db2.getData('/events/allEvents/it');
    med = db2.getData('/events/allEvents/med');
    inj = db2.getData('/events/allEvents/inj');
    openDays = db2.getData('/events/allEvents/openDays');
    point = db2.getData('/events/allEvents/points');
    all = it.concat(med,inj);
    res.send({engeniring: inj, medicine: med, programming: it,allE: all,open: openDays,points: point});
});

app.post('/api/checkedEventsUpdate',function(req,res){ //Сохранение отмеченных мероприятий пользователя
    email = req.body.email;

    result = db.getData('/users/reg/'+email+'/checkedEvents');
    result = result.concat(req.body.events);
    result = deleteRep(result)

    db.push('/users/reg/'+email+'/checkedEvents',result);
    res.send('Save succsesful')  
});

app.get('/api/getCheckedEvents',function(req,res){ //Отдача отмеченных мероприятий
    email = req.headers.email;
    chEvents = db.getData('/users/reg/'+email+'/checkedEvents');
    res.json(chEvents);
});

app.post('/api/mailCheck',function(req,res){ //Отправка на почту кода с подтверждением
    email = req.body.email;
    code = String(Math.round(Math.random()*10)) + String(Math.round(Math.random()*10)) + String(Math.round(Math.random()*10)) + String(Math.round(Math.random()*10)) + String(Math.round(Math.random()*10)) + String(Math.round(Math.random()*10)); 
    res.send(code);
    transporter.sendMail({
        from: '"no-reply_ProfEvents" <noreplyprofevents@gmail.com>',
        to: email,
        subject: "Код подтверждения",
        text: "Ваш код подтверждения: " + String(code) + "\n\n\n\n\nЕсли это не Вы, то просто проигнорируйте данное письмо",
    })
});

app.get('/api/getInformation',function(req,res){//Получение статистики пользователя 
    email = req.headers.email;
    inform = db.getData('/users/reg/'+email);
    res.json(inform);
});

app.post('/api/updateInformation',function(req,res){//Обновление статистики пользователя 
    email = req.body.email;
    
    inform = db.getData('/users/reg/'+email);

    inform = Object.assign(inform,req.body.update);

    db.push('/users/reg/'+email,inform);

    res.send(inform)  
});

app.get('/api/getOtherInformation',function(req,res){//Получение чужой информации учителем или директором
    email = req.headers.email;

    stat = db.getData('/users/reg/'+email);
    roleS = stat.role;
    schoolS = stat.school;
    allS = db.getData('/users/reg');
    result = [[],[],[],[],[],[],[],[],[],[],[]]
    classS = stat.class_number;
    symS = stat.simvol;
    
    
    if (roleS == 'директор'){
        for (var key in allS){
            if ((allS[key].role == 'ученик') && (allS[key].school == schoolS)){
                result[Number(allS[key].class_number)-1].push(allS[key]);
            }
        }
        result = {role: 'директор',data: result};
    }
    if (roleS == 'учитель'){
        console.log(roleS,schoolS)
        for (var key in allS){
            if ((allS[key].role == 'ученик') && (allS[key].school == schoolS) && (allS[key].class_number == classS) && (allS[key].simvol == symS)){
                result[Number(allS[key].class_number)-1].push(allS[key]);
            }
        }
        result = {role: 'учитель',data: result};
    }
    
    res.json(result);
});

app.post('/api/addFriendCode',function(req,res){//Добавление кода друга
    email = req.body.email;
    code = req.body.statNumber;
    console.log(req.body);
    allS = db.getData('/users/reg');
    counter = 0;

    for (var key in allS){
        if (allS[key].statNumber == code){
            fr = db.getData('/users/reg/'+email+'/friends');
            fr = fr.concat(allS[key].statNumber);
            fr = deleteRepArr(fr);
            db.push('/users/reg/'+email+'/friends',fr);
            res.send('Save successful');
            counter++;
        }
    }

    if (counter == 0){
        res.send('Code not found');
    }
});

app.get('/api/getCodeInformation',function(req,res){//Получение статистики друзей
    email = req.headers.email;
    
    allS = db.getData('/users/reg');
    fr = db.getData('/users/reg/'+email).friends;
    result = [];
    for (var i in fr){
        code = fr[i];
        for (var key in allS){
            if (allS[key].statNumber == code){
                result.push(allS[key]);
            }
        }
    }
    res.json(result);
});


let parseTime = 10000; //Таймер парсера
setInterval(function() { //Парсинг сайтов
    var url1 = 'https://events.mosedu.ru/';
    var url2 = 'https://events.educom.ru/calendar?onlyActual=false&pageNumber=1&search=&portalIds=14'
    var url3 = 'https://events.educom.ru/calendar?onlyActual=false&pageNumber=1&search=&portalIds=21'
    var url4 = 'http://edu.repetitor-general.ru/articles/moscow-dod2020.php';
    var url5 = 'https://vuzopedia.ru/region/city/59?page=1'
    var url6 = 'https://vuzopedia.ru/region/city/59?page=2'
    var url7 = 'https://vuzopedia.ru/region/city/59?page=3'

    db2.push('/events/allEvents/it',[],true); //Обнуление базы данных для it
    db2.push('/events/allEvents/med',[],true); //Обнуление базы данных для it
    db2.push('/events/allEvents/inj',[],true); //Обнуление базы данных для it
    db2.push('/events/allEvents/points',[],true);

    fetch(url1, { 
        method: 'get'
    })
    .then(response => {
        return response.text()
    })
    .then(body => {
        let counter2 = 0; //Счетчик для заполнения массива
        let counter1 = 3; //Счетчик для прохода по всем кнопкам
    
        let arr = {}; //Проходной массив для всех элементов события
        mainArr = []; //Массив для хранения данных мероприятий
            
        let $ = cheerio.load(body); //Загрузка html кода страницы
    
        while ($('div[id = "events-list-block"] div:nth-child(' + String(counter1) + ') div:nth-child(4)').text() != ''){ //Пока вызванное мероприятие не станет пустым делать
            let dopS = $('div[id = "events-list-block"] div:nth-child(' + String(counter1) + ') div:nth-child(3)').text().slice(15); //Загрузка типа
            dopS = dopS.slice(0,dopS.length-4); //Обрезание
                
            let dopS2 = $('div[id = "events-list-block"] div:nth-child(' + String(counter1) + ') div:nth-child(2) table tbody tr td div').text(); //Загрузка даты и времени
                
            dopS3 = $('div[id = "events-list-block"] div:nth-child(' + String(counter1) + ') div:nth-child(2) table tbody tr td:nth-child(2) div:nth-child(1)').text();
            dopS3 = dopS3.slice(2);
            dopS3 = dopS3.slice(0,dopS3.indexOf('У'));
                
            arr = {
                name: $('div[id = "events-list-block"] div:nth-child(' + String(counter1) + ') div:nth-child(4)').text(), //Загрузка названия
                type: dopS,
                date: dopS2.slice(0,5), //Заполнение даты
                time: dopS2.slice(7,20), //Заполнение времени 
                link: $('div[id = "events-list-block"] div:nth-child(' + String(counter1) + ') div').attr("onclick").slice(21), //Заполнение ссылки
                places :dopS3,
                id: '/events/allEvents/it'
            }
    
            mainArr[counter2] = arr; //Добавление мероприятия в список
    
            counter1 +=  1; //Увеличение счетчиков
            counter2 += 1;
    
            arr = ['','','','','']; //Обнуление промежуточного массива  
        }
        
        mainArr = mainArr.concat(db2.getData('/events/allEvents/it'))
        db2.push('/events/allEvents/it', mainArr, true);  
    })
    .catch(err => {
        console.log(err)
    })
    
    fetch(url2,{
        method: 'get'
    })
    .then(response => {
        return response.text()
    })
    .then(body => {
        let $ = cheerio.load(body);

        counter1 = 1;
        counter2 = 0;
        mainArr = [];

        while($("section.event-card.small-12.grid-x:nth-child(" + String(counter1) + ") div.event-card__content-description-title").text() != ''){
            preName = $("section.event-card.small-12.grid-x:nth-child(" + String(counter1) + ") div.event-card__content-description-title").text();
            preName = preName.slice(13);
            preName = preName.slice(0,preName.indexOf('\n'));
    
            preDate = $("section.event-card.small-12.grid-x:nth-child(" + String(counter1) + ") div.event-card__date-date.cell.auto.grid-y.align-center-middle").text();
            preDate_num = preDate.slice(0,preDate.indexOf("\n"));
            preDate = preDate.slice(6);
            while(preDate.indexOf(' ') == 0){
                preDate = preDate.slice(1,preDate.length);
            };
    
            preTime = $("section.event-card.small-12.grid-x:nth-child(" + String(counter1) + ") div.event-card__date-time.small-2.grid-y.align-center-middle").text();
            preTime = preTime.slice(9);
            preTime = preTime.slice(0,preTime.indexOf('\n'));
    
            preLink = $("section.event-card.small-12.grid-x:nth-child(" + String(counter1) + ") div.event-card__content-description-title a").attr('href');
    
            prePlaces = $("section.event-card.small-12.grid-x:nth-child(" + String(counter1) + ") div.event-card__content-image-stat.grid-x.align-spaced.align-bottom div:nth-child(2)").text();
            prePlaces = prePlaces.slice(15);
            prePlaces = prePlaces.slice(0,prePlaces.indexOf('\n'));
    
            arr = {
                name: preName,
                date: preDate_num + ' ' + preDate,
                time: preTime,
                type: "Суббота московского школьника",
                link: "https://events.educom.ru" + preLink,
                places: prePlaces,
                id: '/events/allEvents/it'
            };

            mainArr[counter2] = arr;

            counter1 ++;
            counter2 ++;
        }

        mainArr = mainArr.concat(db2.getData('/events/allEvents/it'));
        db2.push('/events/allEvents/it',mainArr);
    })
    .catch(err => {
        console.log(err)
    }) 

    fetch(url3,{
        method: 'get'
    })
    .then(response => {
        return response.text()
    })
    .then(body => {
        let $ = cheerio.load(body);

        counter1 = 1;
        counter2 = 0;
        mainArr = [];

        while($("section.event-card.small-12.grid-x:nth-child(" + String(counter1) + ") div.event-card__content-description-title").text() != ''){
            preName = $("section.event-card.small-12.grid-x:nth-child(" + String(counter1) + ") div.event-card__content-description-title").text();
            preName = preName.slice(13);
            preName = preName.slice(0,preName.indexOf('\n'));
    
            preDate = $("section.event-card.small-12.grid-x:nth-child(" + String(counter1) + ") div.event-card__date-date.cell.auto.grid-y.align-center-middle").text();
            preDate_num = preDate.slice(0,preDate.indexOf("\n"));
            preDate = preDate.slice(6);
            while(preDate.indexOf(' ') == 0){
                preDate = preDate.slice(1,preDate.length);
            };
    
            preTime = $("section.event-card.small-12.grid-x:nth-child(" + String(counter1) + ") div.event-card__date-time.small-2.grid-y.align-center-middle").text();
            preTime = preTime.slice(9);
            preTime = preTime.slice(0,preTime.indexOf('\n'));
    
            preLink = $("section.event-card.small-12.grid-x:nth-child(" + String(counter1) + ") div.event-card__content-description-title a").attr('href');
    
            prePlaces = $("section.event-card.small-12.grid-x:nth-child(" + String(counter1) + ") div.event-card__content-image-stat.grid-x.align-spaced.align-bottom div:nth-child(2)").text();
            prePlaces = prePlaces.slice(15);
            prePlaces = prePlaces.slice(0,prePlaces.indexOf('\n'));
    
            arr = {
                name: preName,
                date: preDate_num + ' ' + preDate,
                time: preTime,
                type: "Суббота московского школьника",
                link: "https://events.educom.ru" + preLink,
                places: prePlaces,
                id: '/events/allEvents/inj'
            };

            mainArr[counter2] = arr;

            counter1 ++;
            counter2 ++;
        }

        mainArr = mainArr.concat(db2.getData('/events/allEvents/inj'));
        db2.push('/events/allEvents/inj',mainArr);
        
    })
    .catch(err => {
        console.log(err)
    })

    
    {const data = new URLSearchParams();
    data.append('debug', '1');
    data.append('api_ver', '9');
    data.append('use_test_events', 'true');
    data.append('limitstart', '0');
    data.append('limit', '10');
    data.append('events_type', 'med');
    data.append('list_chunck_size', '0');
    data.append('show_type', 'current');
    data.append('first_run', '1');
    
    fetch('http://classes.events.mosedu.ru/?format=json/', {
            method: 'post',
            body: data,
    })
    .then(response => response.json())
    .then(data => {
        mainArr = [];
        for (var i in data.events){
            preName = data.events[i].title;
            while (preName.indexOf('  ') != -1){
                preName = preName.replace('  ',' ')
            }

            arr = {
                name: preName,
                type: data.events[i].type[0].title,
                date: data.events[i].stamp_event_start.slice(8,10) + '.' + data.events[i].stamp_event_start.slice(5,7),
                time: data.events[i].stamp_event_start.slice(11,16),
                link: 'http://profil.mos.ru/med.html#/modal/' + data.events[i].id,
                places: 'Неограничено',
                id: '/events/allEvents/med'
            }
            mainArr[i] = arr;
        }

        mainArr = mainArr.concat(db2.getData('/events/allEvents/med'));
        db2.push('/events/allEvents/med',mainArr);
    })
}



    {const data2 = new URLSearchParams();
    data2.append('debug', '1');
    data2.append('api_ver', '9');
    data2.append('use_test_events', 'true');
    data2.append('limitstart', '0');
    data2.append('limit', '10');
    data2.append('events_type', 'inj');
    data2.append('list_chunck_size', '0');
    data2.append('show_type', 'current');
    data2.append('first_run', '1');

    fetch('http://classes.events.mosedu.ru/?format=json/', {
        method: 'post',
        body: data2,
})
.then(response => response.json())
.then(data => {
    mainArr = [];
    for (var i in data.events){
        preName = data.events[i].title;
        while (preName.indexOf('  ') != -1){
            preName = preName.replace('  ',' ')
        }

        arr = {
            name: preName,
            type: data.events[i].type[0].title,
            date: data.events[i].stamp_event_start.slice(8,10) + '.' + data.events[i].stamp_event_start.slice(5,7),
            time: data.events[i].stamp_event_start.slice(11,16),
            link: 'http://profil.mos.ru/inj.html#/modal/' + data.events[i].id,
            places: 'Неограничено',
            id: '/events/allEvents/inj'
        }
        mainArr[i] = arr;
    }

    mainArr = mainArr.concat(db2.getData('/events/allEvents/inj'));
    db2.push('/events/allEvents/inj',mainArr);
    
})
}

fetch(url4, { 
    method: 'get',
    headers: {'Cookie': 'beget=begetok; top100_id=t1.-1.1666596121.1590130488298; last_visit=1590122159434::1590132959434; tmr_reqNum=28; tmr_lvid=93f2f8e0179189848b227321de314ea5; tmr_lvidTS=1590130489260; _ym_uid=1590130489443198407; _ym_d=1590130489; __gads=ID=e6c8c1576719e4f5:T=1590130488:S=ALNI_MZf5CEdKAPLa_up97zHr-6y81Kl4A; _ga=GA1.2.1162348871.1590130489; _gid=GA1.2.715769474.1590130489; _ym_isad=2; tmr_detect=0%7C1590132964884; _gat=1'}
})
.then(response => {
    return response.text()
})
.then(body => {
    var $ = cheerio.load(body);
        counter = 1
        counter2 = 0;
        mainArr = []

        while(counter2 != 15){
            arr = {
                name: $('div.row div.col-md-6.col-sm-6:nth-child(' + String(counter) + ') figcaption.mu-blog-caption a').text(),
                date: $('div.row div.col-md-6.col-sm-6:nth-child(' + String(counter) + ') div.mu-blog-meta a.redd').text(),
                time: $('div.row div.col-md-6.col-sm-6:nth-child(' + String(counter) + ') div.mu-blog-meta span').text().slice(7),
                type: "День открытых дверей",
                link: $('div.row div.col-md-6.col-sm-6:nth-child(' + String(counter) + ') figcaption.mu-blog-caption a').attr('href')
            }

            if (arr.name != ''){
                mainArr[counter2] = arr;
                counter2++;
            }         
            counter++;   
        }
        db2.push('/events/allEvents/openDays',mainArr)
})
.catch(err => {
    console.log(err)
})


fetch(url5, { 
    method: 'get',
    //headers: {'Cookie': 'beget=begetok; top100_id=t1.-1.1666596121.1590130488298; last_visit=1590122159434::1590132959434; tmr_reqNum=28; tmr_lvid=93f2f8e0179189848b227321de314ea5; tmr_lvidTS=1590130489260; _ym_uid=1590130489443198407; _ym_d=1590130489; __gads=ID=e6c8c1576719e4f5:T=1590130488:S=ALNI_MZf5CEdKAPLa_up97zHr-6y81Kl4A; _ga=GA1.2.1162348871.1590130489; _gid=GA1.2.715769474.1590130489; _ym_isad=2; tmr_detect=0%7C1590132964884; _gat=1'}
})
.then(response => {
    return response.text()
})
.then(body => {
    var $ = cheerio.load(body);

    mainArr = [];
    counter = 5;
    counter2 = 0;

    while(counter2 < 19){
        prePrice = $('div.sideContent div:nth-child(' + String(counter)  +') div.col-md-5:nth-child(2) div.col-md-4.info:nth-child(1) a.tooltipq').text();
        preName = $('div.sideContent div:nth-child(' + String(counter)  +') div.itemVuzTitle').text().slice(21);
        preMin = $('div.sideContent div:nth-child(' + String(counter)  +') div.col-md-5:nth-child(2) div.col-md-4.info:nth-child(2) a.tooltipq').text();
        preMin = preMin.slice(3,preMin.indexOf('м'));
        if (preMin == ''){
            preMin = '-'
        };
        preMax = $('div.sideContent div:nth-child(' + String(counter)  +') div.col-md-5:nth-child(2) div.col-md-4.info:nth-child(3) a.tooltipq').text();
        preMax = preMax.slice(3,preMax.indexOf('м'));
        if (preMax == ''){
            preMax = '-'
        };

        if (counter2 >3){
            preName = preName.slice(8);
        }

        arr = {
            name: preName.slice(0,preName.indexOf('\n')),
            price: prePrice.slice(3,prePrice.indexOf('⃏')-1),
            min: preMin,
            max: preMax
        };


        mainArr[counter2] = arr;
        counter+=3;
        counter2++;
    };

    mainArr = mainArr.concat(db2.getData('/events/allEvents/points'));
    db2.push('/events/allEvents/points',mainArr)
})
.catch(err => {
    console.log(err)
})

fetch(url6, { 
    method: 'get',
    //headers: {'Cookie': 'beget=begetok; top100_id=t1.-1.1666596121.1590130488298; last_visit=1590122159434::1590132959434; tmr_reqNum=28; tmr_lvid=93f2f8e0179189848b227321de314ea5; tmr_lvidTS=1590130489260; _ym_uid=1590130489443198407; _ym_d=1590130489; __gads=ID=e6c8c1576719e4f5:T=1590130488:S=ALNI_MZf5CEdKAPLa_up97zHr-6y81Kl4A; _ga=GA1.2.1162348871.1590130489; _gid=GA1.2.715769474.1590130489; _ym_isad=2; tmr_detect=0%7C1590132964884; _gat=1'}
})
.then(response => {
    return response.text()
})
.then(body => {
    var $ = cheerio.load(body);

    mainArr = [];
    counter = 5;
    counter2 = 0;

    while(counter2 < 15){
        prePrice = $('div.sideContent div:nth-child(' + String(counter)  +') div.col-md-5:nth-child(2) div.col-md-4.info:nth-child(1) a.tooltipq').text();
        preName = $('div.sideContent div:nth-child(' + String(counter)  +') div.itemVuzTitle').text().slice(21);
        preMin = $('div.sideContent div:nth-child(' + String(counter)  +') div.col-md-5:nth-child(2) div.col-md-4.info:nth-child(2) a.tooltipq').text();
        preMin = preMin.slice(3,preMin.indexOf('м'));
        if (preMin == ''){
            preMin = '-'
        };
        preMax = $('div.sideContent div:nth-child(' + String(counter)  +') div.col-md-5:nth-child(2) div.col-md-4.info:nth-child(3) a.tooltipq').text();
        preMax = preMax.slice(3,preMax.indexOf('м'));
        if (preMax == ''){
            preMax = '-'
        };

        
        preName = preName.slice(8);
        

        arr = {
            name: preName.slice(0,preName.indexOf('\n')),
            price: prePrice.slice(3,prePrice.indexOf('⃏')-1),
            min: preMin,
            max: preMax
        };


        mainArr[counter2] = arr;
        counter+=3;
        counter2++;
    };


    mainArr = mainArr.concat(db2.getData('/events/allEvents/points'));
    db2.push('/events/allEvents/points',mainArr)
})
.catch(err => {
    console.log(err)
})


fetch(url7, { 
    method: 'get',
    //headers: {'Cookie': 'beget=begetok; top100_id=t1.-1.1666596121.1590130488298; last_visit=1590122159434::1590132959434; tmr_reqNum=28; tmr_lvid=93f2f8e0179189848b227321de314ea5; tmr_lvidTS=1590130489260; _ym_uid=1590130489443198407; _ym_d=1590130489; __gads=ID=e6c8c1576719e4f5:T=1590130488:S=ALNI_MZf5CEdKAPLa_up97zHr-6y81Kl4A; _ga=GA1.2.1162348871.1590130489; _gid=GA1.2.715769474.1590130489; _ym_isad=2; tmr_detect=0%7C1590132964884; _gat=1'}
})
.then(response => {
    return response.text()
})
.then(body => {
    var $ = cheerio.load(body);

    mainArr = [];
    counter = 5;
    counter2 = 0;

    while(counter2 < 15){
        prePrice = $('div.sideContent div:nth-child(' + String(counter)  +') div.col-md-5:nth-child(2) div.col-md-4.info:nth-child(1) a.tooltipq').text();
        preName = $('div.sideContent div:nth-child(' + String(counter)  +') div.itemVuzTitle').text().slice(21);
        preMin = $('div.sideContent div:nth-child(' + String(counter)  +') div.col-md-5:nth-child(2) div.col-md-4.info:nth-child(2) a.tooltipq').text();
        preMin = preMin.slice(3,preMin.indexOf('м'));
        if (preMin == ''){
            preMin = '-'
        };
        preMax = $('div.sideContent div:nth-child(' + String(counter)  +') div.col-md-5:nth-child(2) div.col-md-4.info:nth-child(3) a.tooltipq').text();
        preMax = preMax.slice(3,preMax.indexOf('м'));
        if (preMax == ''){
            preMax = '-'
        };

        
        preName = preName.slice(8);
        

        arr = {
            name: preName.slice(0,preName.indexOf('\n')),
            price: prePrice.slice(3,prePrice.indexOf('⃏')-1),
            min: preMin,
            max: preMax
        };


        mainArr[counter2] = arr;
        counter+=3;
        counter2++;
    };


    mainArr = mainArr.concat(db2.getData('/events/allEvents/points'));
    db2.push('/events/allEvents/points',mainArr)
})
.catch(err => {
    console.log(err)
})





}, parseTime);


let mailingTime = 1000000 //Таймер рассылки напоминаний
setInterval(function(){ //Напоминание о мероприятиях
    users = db.getData('/users/reg');
    var date = new Date();
    time = date.getHours();
    date = date.getDate();
    
    for (var key in users){
        for (var i in users[key].checkedEvents){
            if (((time - Number(users[key].checkedEvents[i].time.slice(0,2))) == 1) && (Number(users[key].checkedEvents[i].date.slice(0,2)) == date)){
                transporter.sendMail({
                    from: '"no-reply_ProfEvents" <noreplyprofevents@gmail.com>',
                    to: users[key].email,
                    subject: "Напоминание о мероприятие",
                    text: 'Внимание! До мероприятия "' + users[key].checkedEvents[i].name + '", на которое Вы зарегистрировались, остался один час.\nСсылка на мероприятие: ' + users[key].checkedEvents[i].link,
                })
            }
        }
    }

}, mailingTime);



app.get('/api/getI',function(req,res){ //Получение тестовой информации
    var data = db2.getData('/events/allEvents');
    res.send(data);
});


app.listen(3000, function(){
    console.log('Express server listening on port 3000');
});