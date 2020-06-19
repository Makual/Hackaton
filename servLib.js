module.exports.testAllData = function(inp){
    if (testData(inp) != 'OK'){
        return generateErr(testData(inp))
    }
    if (testTeacher(inp) != 'OK'){
        return generateErr(testTeacher(inp))
    }
    return 'OK'
};

testDay = function(inp){
    data = inp;
    newArr = [];
    test = 0;

    for (i in data){
        if ((String(data[i]).indexOf(',') != -1) && (typeof(data[i]) != 'object')){
            data.push(data[i].slice(data[i].indexOf(' ')+1,data[i].length));
            data[i] = data[i].slice(0,data[i].indexOf(','));
        };
        if (typeof(data[i]) == 'object'){
            data[i] = data[i][0]
        };
    }
    for (i in data){
        for (counter in newArr){
            if ((data[i] == newArr[counter]) && (data[i] != -1)){
                test = 1;
            }
        }
        if (test == 0){
            newArr.push(data[i]);
        }
        test = 0;
    }

    i = 0
    return (data.length == newArr.length); 
};

testTeacherDay = function(inp){
    data = inp;
    newArr = [];
    test = 0;

    for (i in data){
        if ((String(data[i]).indexOf(',') != -1) && (typeof(data[i]) != 'object')){
            data.push(data[i].slice(data[i].indexOf(',')+1,data[i].length));
            data[i] = data[i].slice(0,data[i].indexOf(','));
        };
        if (typeof(data[i]) == 'object'){
            data[i] = data[i][0]
        };
    }
    for (i in data){
        for (counter in newArr){
            if ((data[i] == newArr[counter]) && (data[i] != -1) && (data[i] != 'Вакансия')){
                test = 1;
            }
        }
        if (test == 0){
            newArr.push(data[i]);
        }
        test = 0;
    }

    i = 0;
    return (data.length == newArr.length); 
};

testData = function(data){
    classroomArr = [];
    arr = [];
    test = 0;
    res = false;

    
    for(var i = 0;i<5;i++){
        for (var counter = 0;counter<5;counter++){
            for (var counter1 = 0;counter1<4;counter1++){
                if ((data[counter1].day[i][counter].classroom == undefined) || (data[counter1].day[i][counter].classroom == undefined)){
                    if ((data[counter1].day[i][counter].classroomF != undefined)){
                        arr[0] = data[counter1].day[i][counter].classroomF;
                        arr[1] = -1;
                        test = 1;
                    }
                    if ((data[counter1].day[i][counter].classroomS != undefined)){
                        arr[1] = data[counter1].day[i][counter].classroomS;
                        if (test == 0){
                            arr[0] = -1;
                        }
                    }
                    if ((arr[0] != undefined) || (arr[1] != undefined)){
                        classroomArr.push(arr);
                    }
                    else{
                        classroomArr.push(-1);
                    }
                }
                else{
                    classroomArr.push(data[counter1].day[i][counter].classroom);
                }
                arr = [];
                test = 0;
            }

            if (!testDay(classroomArr)){
                co1 = Number(counter);
                co1 += 1;
                co = Number(i)
                co += 6;
                return('err_classroom*' + String(co) + '('+ String(co1))
            };
            
            classroomArr = [];
            
        }   
    }
    
    return 'OK';
};

testTeacher = function(data){
    teacherArr = [];
    arr = [];
    test = 0;
    res = false;


    for(var i = 0;i<5;i++){
        for (var counter = 0;counter<5;counter++){
            for (var counter1 = 0;counter1<4;counter1++){
                if ((data[counter1].day[i][counter].teacher == undefined) || (data[counter1].day[i][counter].teacher == undefined)){
                    if ((data[counter1].day[i][counter].teacherF != undefined)){
                        arr[0] = data[counter1].day[i][counter].teacherF;
                        arr[1] = -1;
                        test = 1;
                    }
                    if ((data[counter1].day[i][counter].teacherS != undefined)){
                        arr[1] = data[counter1].day[i][counter].teacherS;
                        if (test == 0){
                            arr[0] = -1;
                        }
                    }
                    if ((arr[0] != undefined) || (arr[1] != undefined)){
                        teacherArr.push(arr);
                    }
                    else{
                        teacherArr.push(-1);
                    }
                }
                else{
                    teacherArr.push(data[counter1].day[i][counter].teacher);
                }
                arr = [];
                test = 0;
            }
            
            if (!testTeacherDay(teacherArr)){
                co1 = Number(counter);
                co1 += 1;
                co = Number(i)
                co += 6;
                return('err_teacher*' + String(co) + '('+ String(co1))
            };

            teacherArr = [];   
        }
    }

    return 'OK'
};

deleteRepArr = function(arr) {
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
};

module.exports.findAllGroups = function(data){
    newArr = [[],[],[],[],[]]
    for (i in data){
        newArr[data[i].course-1].push(data[i].class);
    }
    return newArr
};

module.exports.findAllTeachers = function(data){
    newArr = []
    for (i in data){
        for (counter2 in data[i].day){
            for (counter in data[i].day[counter2]){
                if ((data[i].day[counter2][counter].teacher != null) && (data[i].day[counter2][counter].teacher != undefined)){
                    if (data[i].day[counter2][counter].teacher.indexOf(',') == -1){
                        if (data[i].day[counter2][counter].teacher != 'Вакансия'){
                            newArr.push(data[i].day[counter2][counter].teacher);
                        }
                    }
                    else{
                        newArr.push(data[i].day[counter2][counter].teacher.slice(0,data[i].day[counter2][counter].teacher.indexOf(',')))
                        newArr.push(data[i].day[counter2][counter].teacher.slice(data[i].day[counter2][counter].teacher.indexOf(',')+1,data[i].day[counter2][counter].teacher.length))
                    } 
                }
                if ((data[i].day[counter2][counter].teacherF != null) && (data[i].day[counter2][counter].teacherF != undefined)){
                    newArr.push(data[i].day[counter2][counter].teacherF);
                }
                if ((data[i].day[counter2][counter].teacherS != null) && (data[i].day[counter2][counter].teacherS != undefined)){
                    newArr.push(data[i].day[counter2][counter].teacherS);
                }
            }  
        }
    }

    newArr = deleteRepArr(newArr);
    newArr.sort();
    return newArr
};

module.exports.findAllClassrooms = function(data){
    newArr = []
    for (i in data){
        for (counter2 in data[i].day){
            for (counter in data[i].day[counter2]){
                if ((data[i].day[counter2][counter].classroom != null) && (data[i].day[counter2][counter].classroom != undefined)){
                    if (String(data[i].day[counter2][counter].classroom).indexOf(',') == -1){
                        newArr.push(String(data[i].day[counter2][counter].classroom));
                    }
                    else{
                        if (String(data[i].day[counter2][counter].classroom).indexOf('  ') == -1){
                            newArr.push(String(data[i].day[counter2][counter].classroom.slice(data[i].day[counter2][counter].classroom.indexOf(',')+2,data[i].day[counter2][counter].classroom.length)))
                        }
                        else{
                            newArr.push(String(data[i].day[counter2][counter].classroom.slice(data[i].day[counter2][counter].classroom.indexOf(',')+3,data[i].day[counter2][counter].classroom.length)))
                        }
                        newArr.push(String(data[i].day[counter2][counter].classroom.slice(0,data[i].day[counter2][counter].classroom.indexOf(','))));
                    } 
                }
                if ((data[i].day[counter2][counter].classroomF != null) && (data[i].day[counter2][counter].classroomF != undefined)){
                    newArr.push(String(data[i].day[counter2][counter].classroomF));
                }
                if ((data[i].day[counter2][counter].classroomS != null) && (data[i].day[counter2][counter].classroomS != undefined)){
                    newArr.push(String(data[i].day[counter2][counter].classroomS));
                }  
            }
        }
    }
    newArr = deleteRepArr(newArr);
    newArr.sort();
    return newArr 
};

module.exports.findTeacher = function(data,tName){
    newArr = [[{},{},{},{},{}],[{},{},{},{},{}],[{},{},{},{},{}],[{},{},{},{},{}],[{},{},{},{},{}]]
    for (i in data){
        for (counter in data[i].day){
            for (counter2 in data[i].day[counter]){
                    if ((data[i].day[counter][counter2].teacher != null) && (data[i].day[counter][counter2].teacher != undefined)){
                        if (data[i].day[counter][counter2].teacher.indexOf(',') != -1){
                            firstName = data[i].day[counter][counter2].teacher.slice(0,data[i].day[counter][counter2].teacher.indexOf(','));
                            secondName = data[i].day[counter][counter2].teacher.slice(data[i].day[counter][counter2].teacher.indexOf(',')+1,data[i].day[counter][counter2].teacher.length);
                        
                            if ((firstName == tName)){
                                newArr[counter][counter2].group = data[i].class;
                                newArr[counter][counter2].teacher = firstName;
                                if ((data[i].day[counter][counter2].name != null) && (data[i].day[counter][counter2].name != undefined)){
                                    if (data[i].day[counter][counter2].name.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].name = data[i].day[counter][counter2].name;       
                                    }
                                    else{
                                        newArr[counter][counter2].name = data[i].day[counter][counter2].name.slice(0,data[i].day[counter][counter2].name.indexOf('п/гр')+4)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].nameF != null) && (data[i].day[counter][counter2].nameF != undefined)){
                                    if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;       
                                    }
                                    else{
                                        newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF.slice(0,data[i].day[counter][counter2].nameF.indexOf('п/гр')+4)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].nameS != null) && (data[i].day[counter][counter2].nameS != undefined)){
                                    if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;       
                                    }
                                    else{
                                        newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS.slice(0,data[i].day[counter][counter2].nameS.indexOf('п/гр')+4)
                                    }
                                }
    
                                if ((data[i].day[counter][counter2].classroom != null) && (data[i].day[counter][counter2].classroom != undefined)){
                                    if (String(data[i].day[counter][counter2].classroom).indexOf(',') == -1){
                                        newArr[counter][counter2].classroom = data[i].day[counter][counter2].classroom;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroom = data[i].day[counter][counter2].classroom.slice(0,data[i].day[counter][counter2].classroom.indexOf(','))
                                    }
                                }
                                else if ((data[i].day[counter][counter2].classroomF != null) && (data[i].day[counter][counter2].classroomF != undefined)){
                                    if (String(data[i].day[counter][counter2].classroomS).indexOf(',') == -1){
                                        newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF.slice(0,data[i].day[counter][counter2].classroomF.indexOf(','))
                                    }
                                }
                                else if ((data[i].day[counter][counter2].classroomS != null) && (data[i].day[counter][counter2].classroomS != undefined)){
                                    if (String(data[i].day[counter][counter2].classroomS).indexOf(',') == -1){
                                        newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS.slice(0,data[i].day[counter][counter2].classroomS.indexOf(','))
                                    }
                                }
                            }
    
                            if ((secondName == tName)){
                                newArr[counter][counter2].group = data[i].class;
                                newArr[counter][counter2].teacher = secondName;
                                if ((data[i].day[counter][counter2].name != null) && (data[i].day[counter][counter2].name != undefined)){
                                    if (data[i].day[counter][counter2].name.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].name = data[i].day[counter][counter2].name;       
                                    }
                                    else{
                                        newArr[counter][counter2].name = data[i].day[counter][counter2].name.slice(data[i].day[counter][counter2].name.indexOf('п/гр')+5,data[i].day[counter][counter2].length)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].nameF != null) && (data[i].day[counter][counter2].nameF != undefined)){
                                    if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;       
                                    }
                                    else{
                                        newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF.slice(data[i].day[counter][counter2].nameF.indexOf('п/гр')+5,data[i].day[counter][counter2].nameF.length)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].nameS != null) && (data[i].day[counter][counter2].nameS != undefined)){
                                    if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;       
                                    }
                                    else{
                                        newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS.slice(data[i].day[counter][counter2].nameS.indexOf('п/гр')+5,data[i].day[counter][counter2].nameS.length)
                                    }
                                }
    
                                if ((data[i].day[counter][counter2].classroom != null) && (data[i].day[counter][counter2].classroom != undefined)){
                                    if (String(data[i].day[counter][counter2].classroom).indexOf(',') == -1){
                                        newArr[counter][counter2].classroom = data[i].day[counter][counter2].classroom;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroom = data[i].day[counter][counter2].classroom.slice(data[i].day[counter][counter2].classroom.indexOf(',')+3,data[i].day[counter][counter2].classroom.length)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].classroomF != null) && (data[i].day[counter][counter2].classroomF != undefined)){
                                    if (String(data[i].day[counter][counter2].classroomS).indexOf(',') == -1){
                                        newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF.slice(data[i].day[counter][counter2].classroomF.indexOf(',')+3,data[i].day[counter][counter2].classroomF.length)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].classroomS != null) && (data[i].day[counter][counter2].classroomS != undefined)){
                                    if (String(data[i].day[counter][counter2].classroomS).indexOf(',') == -1){
                                        newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS.slice(data[i].day[counter][counter2].classroomS.indexOf(',')+3,data[i].day[counter][counter2].classroomS.length)
                                    }
                                }
                            }
                        }
                    }

                    if ((data[i].day[counter][counter2].teacherF != null) && (data[i].day[counter][counter2].teacherF != undefined)){
                        if (data[i].day[counter][counter2].teacherF.indexOf(',') != -1){
                            firstNameF = data[i].day[counter][counter2].teacherF.slice(0,data[i].day[counter][counter2].teacherF.indexOf(','));
                            secondNameF = data[i].day[counter][counter2].teacherF.slice(data[i].day[counter][counter2].teacherF.indexOf(',')+1,data[i].day[counter][counter2].teacherF.length);
                        
                            if ((firstNameF == tName)){
                                newArr[counter][counter2].teacherF = firstName;
                                newArr[counter][counter2].groupF = data[i].class;
                                if ((data[i].day[counter][counter2].name != null) && (data[i].day[counter][counter2].name != undefined)){
                                    if (data[i].day[counter][counter2].name.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].name = data[i].day[counter][counter2].name;       
                                    }
                                    else{
                                        newArr[counter][counter2].name = data[i].day[counter][counter2].name.slice(0,data[i].day[counter][counter2].name.indexOf('п/гр')+4)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].nameF != null) && (data[i].day[counter][counter2].nameF != undefined)){
                                    if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;       
                                    }
                                    else{
                                        newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF.slice(0,data[i].day[counter][counter2].nameF.indexOf('п/гр')+4)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].nameS != null) && (data[i].day[counter][counter2].nameS != undefined)){
                                    if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;       
                                    }
                                    else{
                                        newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS.slice(0,data[i].day[counter][counter2].nameS.indexOf('п/гр')+4)
                                    }
                                }
    
                                if ((data[i].day[counter][counter2].classroom != null) && (data[i].day[counter][counter2].classroom != undefined)){
                                    if (String(data[i].day[counter][counter2].classroom).indexOf(',') == -1){
                                        newArr[counter][counter2].classroom = data[i].day[counter][counter2].classroom;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroom = data[i].day[counter][counter2].classroom.slice(0,data[i].day[counter][counter2].classroom.indexOf(','))
                                    }
                                }
                                else if ((data[i].day[counter][counter2].classroomF != null) && (data[i].day[counter][counter2].classroomF != undefined)){
                                    if (String(data[i].day[counter][counter2].classroomS).indexOf(',') == -1){
                                        newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF.slice(0,data[i].day[counter][counter2].classroomF.indexOf(','))
                                    }
                                }
                                else if ((data[i].day[counter][counter2].classroomS != null) && (data[i].day[counter][counter2].classroomS != undefined)){
                                    if (String(data[i].day[counter][counter2].classroomS).indexOf(',') == -1){
                                        newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS.slice(0,data[i].day[counter][counter2].classroomS.indexOf(','))
                                    }
                                }
                            }
    
                            if ((secondNameF == tName)){
                                newArr[counter][counter2].groupF = data[i].class;
                                newArr[counter][counter2].teacherF = secondName;
                                if ((data[i].day[counter][counter2].name != null) && (data[i].day[counter][counter2].name != undefined)){
                                    if (data[i].day[counter][counter2].name.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].name = data[i].day[counter][counter2].name;       
                                    }
                                    else{
                                        newArr[counter][counter2].name = data[i].day[counter][counter2].name.slice(data[i].day[counter][counter2].name.indexOf('п/гр')+5,data[i].day[counter][counter2].length)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].nameF != null) && (data[i].day[counter][counter2].nameF != undefined)){
                                    if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;       
                                    }
                                    else{
                                        newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF.slice(data[i].day[counter][counter2].nameF.indexOf('п/гр')+5,data[i].day[counter][counter2].nameF.length)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].nameS != null) && (data[i].day[counter][counter2].nameS != undefined)){
                                    if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;       
                                    }
                                    else{
                                        newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS.slice(data[i].day[counter][counter2].nameS.indexOf('п/гр')+5,data[i].day[counter][counter2].nameS.length)
                                    }
                                }
    
                                if ((data[i].day[counter][counter2].classroom != null) && (data[i].day[counter][counter2].classroom != undefined)){
                                    if (String(data[i].day[counter][counter2].classroom).indexOf(',') == -1){
                                        newArr[counter][counter2].classroom = data[i].day[counter][counter2].classroom;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroom = data[i].day[counter][counter2].classroom.slice(data[i].day[counter][counter2].classroom.indexOf(',')+3,data[i].day[counter][counter2].classroom.length)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].classroomF != null) && (data[i].day[counter][counter2].classroomF != undefined)){
                                    if (String(data[i].day[counter][counter2].classroomS).indexOf(',') == -1){
                                        newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF.slice(data[i].day[counter][counter2].classroomF.indexOf(',')+3,data[i].day[counter][counter2].classroomF.length)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].classroomS != null) && (data[i].day[counter][counter2].classroomS != undefined)){
                                    if (String(data[i].day[counter][counter2].classroomS).indexOf(',') == -1){
                                        newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS.slice(data[i].day[counter][counter2].classroomS.indexOf(',')+3,data[i].day[counter][counter2].classroomS.length)
                                    }
                                }
                            }
                        }
                    }
                        
                    if ((data[i].day[counter][counter2].teacherS != null) && (data[i].day[counter][counter2].teacherS != undefined)){
                        if (data[i].day[counter][counter2].teacherS.indexOf(',') != -1){
                            firstNameS = data[i].day[counter][counter2].teacherS.slice(0,data[i].day[counter][counter2].teacherS.indexOf(','));
                            secondNameS = data[i].day[counter][counter2].teacherS.slice(data[i].day[counter][counter2].teacherS.indexOf(',')+1,data[i].day[counter][counter2].teacherS.length);
                            

                            if ((firstNameS == tName)){
                                newArr[counter][counter2].groupS = data[i].class;
                                newArr[counter][counter2].teacherS = firstName;
                                if ((data[i].day[counter][counter2].name != null) && (data[i].day[counter][counter2].name != undefined)){
                                    if (data[i].day[counter][counter2].name.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].name = data[i].day[counter][counter2].name;       
                                    }
                                    else{
                                        newArr[counter][counter2].name = data[i].day[counter][counter2].name.slice(0,data[i].day[counter][counter2].name.indexOf('п/гр')+4)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].nameF != null) && (data[i].day[counter][counter2].nameF != undefined)){
                                    if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;       
                                    }
                                    else{
                                        newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF.slice(0,data[i].day[counter][counter2].nameF.indexOf('п/гр')+4)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].nameS != null) && (data[i].day[counter][counter2].nameS != undefined)){
                                    if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;       
                                    }
                                    else{
                                        newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS.slice(0,data[i].day[counter][counter2].nameS.indexOf('п/гр')+4)
                                    }
                                }
    
                                if ((data[i].day[counter][counter2].classroom != null) && (data[i].day[counter][counter2].classroom != undefined)){
                                    if (String(data[i].day[counter][counter2].classroom).indexOf(',') == -1){
                                        newArr[counter][counter2].classroom = data[i].day[counter][counter2].classroom;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroom = data[i].day[counter][counter2].classroom.slice(0,data[i].day[counter][counter2].classroom.indexOf(','))
                                    }
                                }
                                else if ((data[i].day[counter][counter2].classroomF != null) && (data[i].day[counter][counter2].classroomF != undefined)){
                                    if (String(data[i].day[counter][counter2].classroomS).indexOf(',') == -1){
                                        newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF.slice(0,data[i].day[counter][counter2].classroomF.indexOf(','))
                                    }
                                }
                                else if ((data[i].day[counter][counter2].classroomS != null) && (data[i].day[counter][counter2].classroomS != undefined)){
                                    if (String(data[i].day[counter][counter2].classroomS).indexOf(',') == -1){
                                        newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS.slice(0,data[i].day[counter][counter2].classroomS.indexOf(','))
                                    }
                                }
                            }
    
                            if ((secondNameS == tName)){
                                newArr[counter][counter2].groupS = data[i].class;
                                newArr[counter][counter2].teacherS = secondName;
                                if ((data[i].day[counter][counter2].name != null) && (data[i].day[counter][counter2].name != undefined)){
                                    if (data[i].day[counter][counter2].name.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].name = data[i].day[counter][counter2].name;       
                                    }
                                    else{
                                        newArr[counter][counter2].name = data[i].day[counter][counter2].name.slice(data[i].day[counter][counter2].name.indexOf('п/гр')+5,data[i].day[counter][counter2].length)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].nameF != null) && (data[i].day[counter][counter2].nameF != undefined)){
                                    if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;       
                                    }
                                    else{
                                        newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF.slice(data[i].day[counter][counter2].nameF.indexOf('п/гр')+5,data[i].day[counter][counter2].nameF.length)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].nameS != null) && (data[i].day[counter][counter2].nameS != undefined)){
                                    if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                        newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;       
                                    }
                                    else{
                                        newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS.slice(data[i].day[counter][counter2].nameS.indexOf('п/гр')+5,data[i].day[counter][counter2].nameS.length)
                                    }
                                }
    
                                if ((data[i].day[counter][counter2].classroom != null) && (data[i].day[counter][counter2].classroom != undefined)){
                                    if (String(data[i].day[counter][counter2].classroom).indexOf(',') == -1){
                                        newArr[counter][counter2].classroom = data[i].day[counter][counter2].classroom;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroom = data[i].day[counter][counter2].classroom.slice(data[i].day[counter][counter2].classroom.indexOf(',')+3,data[i].day[counter][counter2].classroom.length)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].classroomF != null) && (data[i].day[counter][counter2].classroomF != undefined)){
                                    if (String(data[i].day[counter][counter2].classroomS).indexOf(',') == -1){
                                        newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF.slice(data[i].day[counter][counter2].classroomF.indexOf(',')+3,data[i].day[counter][counter2].classroomF.length)
                                    }
                                }
                                else if ((data[i].day[counter][counter2].classroomS != null) && (data[i].day[counter][counter2].classroomS != undefined)){
                                    if (String(data[i].day[counter][counter2].classroomS).indexOf(',') == -1){
                                        newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS;       
                                    }
                                    else{
                                        newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS.slice(data[i].day[counter][counter2].classroomS.indexOf(',')+3,data[i].day[counter][counter2].classroomS.length)
                                    }
                                }
                            }
                        }
                    }

                if (data[i].day[counter][counter2].teacher == tName){
                    newArr[counter][counter2] = data[i].day[counter][counter2];
                    newArr[counter][counter2].group = data[i].class;
                }
                if (data[i].day[counter][counter2].teacherF == tName){
                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;
                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF;
                    newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF;
                    newArr[counter][counter2].groupF = data[i].class;
                }
                if (data[i].day[counter][counter2].teacherS == tName){
                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;
                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS;
                    newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS;
                    newArr[counter][counter2].groupS = data[i].class;
                }
            }
        }
    }
    return newArr
};

module.exports.findClassroom = function(data,cName){
    newArr = [[{},{},{},{},{}],[{},{},{},{},{}],[{},{},{},{},{}],[{},{},{},{},{}],[{},{},{},{},{}]]
    
    for (i in data){
        for (counter in data[i].day){
            for (counter2 in data[i].day[counter]){

                if ((data[i].day[counter][counter2].classroom != null) && (data[i].day[counter][counter2].classroom != undefined)){
                    if (String(data[i].day[counter][counter2].classroom).indexOf(',') != -1){
                        data[i].day[counter][counter2].classroom = data[i].day[counter][counter2].classroom.replace(/\s/g,'')
                        firstName = data[i].day[counter][counter2].classroom.slice(0,data[i].day[counter][counter2].classroom.indexOf(','));
                        secondName = data[i].day[counter][counter2].classroom.slice(data[i].day[counter][counter2].classroom.indexOf(',')+1,data[i].day[counter][counter2].classroom.length);
                        if ((firstName == cName)){
                            newArr[counter][counter2].group = data[i].class;
                            newArr[counter][counter2].classroom = firstName;
                            if ((data[i].day[counter][counter2].name != null) && (data[i].day[counter][counter2].name != undefined)){
                                if (data[i].day[counter][counter2].name.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].name = data[i].day[counter][counter2].name;       
                                }
                                else{
                                    newArr[counter][counter2].name = data[i].day[counter][counter2].name.slice(0,data[i].day[counter][counter2].name.indexOf('п/гр')+4)
                                }
                            }
                            else if ((data[i].day[counter][counter2].nameF != null) && (data[i].day[counter][counter2].nameF != undefined)){
                                if (data[i].day[counter][counter2].nameF.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;       
                                }
                                else{
                                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF.slice(0,data[i].day[counter][counter2].nameF.indexOf('п/гр')+4)
                                }
                            }
                            else if ((data[i].day[counter][counter2].nameS != null) && (data[i].day[counter][counter2].nameS != undefined)){
                                if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;       
                                }
                                else{
                                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS.slice(0,data[i].day[counter][counter2].nameS.indexOf('п/гр')+4)
                                }
                            }

                            if ((data[i].day[counter][counter2].teacher != null) && (data[i].day[counter][counter2].teacher != undefined)){
                                if (String(data[i].day[counter][counter2].teacher).indexOf(',') == -1){
                                    newArr[counter][counter2].teacher = data[i].day[counter][counter2].teacher;       
                                }
                                else{
                                    newArr[counter][counter2].teacher = data[i].day[counter][counter2].teacher.slice(0,data[i].day[counter][counter2].teacher.indexOf(','))
                                }
                            }
                            else if ((data[i].day[counter][counter2].teacherF != null) && (data[i].day[counter][counter2].teacherF != undefined)){
                                if (String(data[i].day[counter][counter2].teacherF).indexOf(',') == -1){
                                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF;       
                                }
                                else{
                                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF.slice(0,data[i].day[counter][counter2].teacherF.indexOf(','))
                                }
                            }
                            else if ((data[i].day[counter][counter2].teacherS != null) && (data[i].day[counter][counter2].teacherS != undefined)){
                                if (String(data[i].day[counter][counter2].teacherS).indexOf(',') == -1){
                                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS;       
                                }
                                else{
                                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS.slice(0,data[i].day[counter][counter2].teacherS.indexOf(','))
                                }
                            }
                        }

                        if ((secondName == cName)){
                            newArr[counter][counter2].group = data[i].class;
                            newArr[counter][counter2].classroom = secondName;
                            if ((data[i].day[counter][counter2].name != null) && (data[i].day[counter][counter2].name != undefined)){
                                if (data[i].day[counter][counter2].name.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].name = data[i].day[counter][counter2].name;       
                                }
                                else{
                                    newArr[counter][counter2].name = data[i].day[counter][counter2].name.slice(data[i].day[counter][counter2].name.indexOf('п/гр')+5,data[i].day[counter][counter2].length)
                                }
                            }
                            else if ((data[i].day[counter][counter2].nameF != null) && (data[i].day[counter][counter2].nameF != undefined)){
                                if (data[i].day[counter][counter2].nameF.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;       
                                }
                                else{
                                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF.slice(data[i].day[counter][counter2].nameF.indexOf('п/гр')+5,data[i].day[counter][counter2].nameF.length)
                                }
                            }
                            else if ((data[i].day[counter][counter2].nameS != null) && (data[i].day[counter][counter2].nameS != undefined)){
                                if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;       
                                }
                                else{
                                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS.slice(data[i].day[counter][counter2].nameS.indexOf('п/гр')+5,data[i].day[counter][counter2].nameS.length)
                                }
                            }

                            if ((data[i].day[counter][counter2].teacher != null) && (data[i].day[counter][counter2].teacher != undefined)){
                                if (String(data[i].day[counter][counter2].teacher).indexOf(',') == -1){
                                    newArr[counter][counter2].teacher = data[i].day[counter][counter2].teacher;       
                                }
                                else{
                                    newArr[counter][counter2].teacher = data[i].day[counter][counter2].teacher.slice(data[i].day[counter][counter2].teacher.indexOf(',')+1,data[i].day[counter][counter2].teacher.length)
                                }
                            }
                            else if ((data[i].day[counter][counter2].teacherF != null) && (data[i].day[counter][counter2].teacherF != undefined)){
                                if (String(data[i].day[counter][counter2].teacherF).indexOf(',') == -1){
                                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF;       
                                }
                                else{
                                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF.slice(data[i].day[counter][counter2].teacherF.indexOf(',')+1,data[i].day[counter][counter2].teacherF.length)
                                }
                            }
                            else if ((data[i].day[counter][counter2].teacherS != null) && (data[i].day[counter][counter2].teacherS != undefined)){
                                if (String(data[i].day[counter][counter2].teacherS).indexOf(',') == -1){
                                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS;       
                                }
                                else{
                                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS.slice(data[i].day[counter][counter2].teacherS.indexOf(',')+1,data[i].day[counter][counter2].teacherS.length)
                                }
                            }
                        }
                    }
                }

                if ((data[i].day[counter][counter2].classroomF != null) && (data[i].day[counter][counter2].classroomF != undefined)){
                    if (String(data[i].day[counter][counter2].classroomF).indexOf(',') != -1){
                        data[i].day[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF.replace(/\s/g,'')
                        firstNameF = data[i].day[counter][counter2].classroomF.slice(0,data[i].day[counter][counter2].classroomF.indexOf(','));
                        secondNameF = data[i].day[counter][counter2].classroomF.slice(data[i].day[counter][counter2].classroomF.indexOf(',')+1,data[i].day[counter][counter2].classroomF.length);
                    
                        if ((firstNameF == cName)){
                            newArr[counter][counter2].groupF = data[i].class;
                            newArr[counter][counter2].classroomF = firstName;
                            if ((data[i].day[counter][counter2].name != null) && (data[i].day[counter][counter2].name != undefined)){
                                if (data[i].day[counter][counter2].name.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].name = data[i].day[counter][counter2].name;       
                                }
                                else{
                                    newArr[counter][counter2].name = data[i].day[counter][counter2].name.slice(0,data[i].day[counter][counter2].name.indexOf('п/гр')+4)
                                }
                            }
                            else if ((data[i].day[counter][counter2].nameF != null) && (data[i].day[counter][counter2].nameF != undefined)){
                                if (data[i].day[counter][counter2].nameF.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;       
                                }
                                else{
                                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF.slice(0,data[i].day[counter][counter2].nameF.indexOf('п/гр')+4)
                                }
                            }
                            else if ((data[i].day[counter][counter2].nameS != null) && (data[i].day[counter][counter2].nameS != undefined)){
                                if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;       
                                }
                                else{
                                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS.slice(0,data[i].day[counter][counter2].nameS.indexOf('п/гр')+4)
                                }
                            }

                            if ((data[i].day[counter][counter2].teacher != null) && (data[i].day[counter][counter2].teacher != undefined)){
                                if (String(data[i].day[counter][counter2].teacher).indexOf(',') == -1){
                                    newArr[counter][counter2].teacher = data[i].day[counter][counter2].teacher;       
                                }
                                else{
                                    newArr[counter][counter2].teacher = data[i].day[counter][counter2].teacher.slice(0,data[i].day[counter][counter2].teacher.indexOf(','))
                                }
                            }
                            else if ((data[i].day[counter][counter2].teacherF != null) && (data[i].day[counter][counter2].teacherF != undefined)){
                                if (String(data[i].day[counter][counter2].teacherF).indexOf(',') == -1){
                                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF;       
                                }
                                else{
                                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF.slice(0,data[i].day[counter][counter2].teacherF.indexOf(','))
                                }
                            }
                            else if ((data[i].day[counter][counter2].teacherS != null) && (data[i].day[counter][counter2].teacherS != undefined)){
                                if (String(data[i].day[counter][counter2].teacherS).indexOf(',') == -1){
                                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS;       
                                }
                                else{
                                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS.slice(0,data[i].day[counter][counter2].teacherS.indexOf(','))
                                }
                            }
                        }

                        if ((secondNameF == cName)){
                            newArr[counter][counter2].groupF = data[i].class;
                            newArr[counter][counter2].classroomF = secondName;
                            if ((data[i].day[counter][counter2].name != null) && (data[i].day[counter][counter2].name != undefined)){
                                if (data[i].day[counter][counter2].name.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].name = data[i].day[counter][counter2].name;       
                                }
                                else{
                                    newArr[counter][counter2].name = data[i].day[counter][counter2].name.slice(data[i].day[counter][counter2].name.indexOf('п/гр')+5,data[i].day[counter][counter2].length)
                                }
                            }
                            else if ((data[i].day[counter][counter2].nameF != null) && (data[i].day[counter][counter2].nameF != undefined)){
                                if (data[i].day[counter][counter2].nameF.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;       
                                }
                                else{
                                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF.slice(data[i].day[counter][counter2].nameF.indexOf('п/гр')+5,data[i].day[counter][counter2].nameF.length)
                                }
                            }
                            else if ((data[i].day[counter][counter2].nameS != null) && (data[i].day[counter][counter2].nameS != undefined)){
                                if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;       
                                }
                                else{
                                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS.slice(data[i].day[counter][counter2].nameS.indexOf('п/гр')+5,data[i].day[counter][counter2].nameS.length)
                                }
                            }

                            if ((data[i].day[counter][counter2].teacher != null) && (data[i].day[counter][counter2].teacher != undefined)){
                                if (String(data[i].day[counter][counter2].teacher).indexOf(',') == -1){
                                    newArr[counter][counter2].teacher = data[i].day[counter][counter2].teacher;       
                                }
                                else{
                                    newArr[counter][counter2].teacher = data[i].day[counter][counter2].teacher.slice(data[i].day[counter][counter2].teacher.indexOf(',')+1,data[i].day[counter][counter2].teacher.length)
                                }
                            }
                            else if ((data[i].day[counter][counter2].teacherF != null) && (data[i].day[counter][counter2].teacherF != undefined)){
                                if (String(data[i].day[counter][counter2].teacherF).indexOf(',') == -1){
                                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF;       
                                }
                                else{
                                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF.slice(data[i].day[counter][counter2].teacherF.indexOf(',')+1,data[i].day[counter][counter2].teacherF.length)
                                }
                            }
                            else if ((data[i].day[counter][counter2].teacherS != null) && (data[i].day[counter][counter2].teacherS != undefined)){
                                if (String(data[i].day[counter][counter2].teacherS).indexOf(',') == -1){
                                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS;       
                                }
                                else{
                                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS.slice(data[i].day[counter][counter2].teacherS.indexOf(',')+1,data[i].day[counter][counter2].teacherS.length)
                                }
                            }
                        }
                    }
                }
                    
                if ((data[i].day[counter][counter2].classroomS != null) && (data[i].day[counter][counter2].classroomS != undefined)){
                    if (String(data[i].day[counter][counter2].classroomS).indexOf(',') != -1){
                        data[i].day[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS.replace(/\s/g,'')
                        firstNameS = data[i].day[counter][counter2].classroomS.slice(0,data[i].day[counter][counter2].classroomS.indexOf(','));
                        secondNameS = data[i].day[counter][counter2].classroomS.slice(data[i].day[counter][counter2].classroomS.indexOf(',')+1,data[i].day[counter][counter2].classroomS.length);
                        

                        if ((firstNameS == cName)){
                            newArr[counter][counter2].groupS = data[i].class;
                            newArr[counter][counter2].classroomS = firstName;
                            if ((data[i].day[counter][counter2].name != null) && (data[i].day[counter][counter2].name != undefined)){
                                if (data[i].day[counter][counter2].name.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].name = data[i].day[counter][counter2].name;       
                                }
                                else{
                                    newArr[counter][counter2].name = data[i].day[counter][counter2].name.slice(0,data[i].day[counter][counter2].name.indexOf('п/гр')+4)
                                }
                            }
                            else if ((data[i].day[counter][counter2].nameF != null) && (data[i].day[counter][counter2].nameF != undefined)){
                                if (data[i].day[counter][counter2].nameF.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;       
                                }
                                else{
                                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF.slice(0,data[i].day[counter][counter2].nameF.indexOf('п/гр')+4)
                                }
                            }
                            else if ((data[i].day[counter][counter2].nameS != null) && (data[i].day[counter][counter2].nameS != undefined)){
                                if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;       
                                }
                                else{
                                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS.slice(0,data[i].day[counter][counter2].nameS.indexOf('п/гр')+4)
                                }
                            }

                            if ((data[i].day[counter][counter2].teacher != null) && (data[i].day[counter][counter2].teacher != undefined)){
                                if (String(data[i].day[counter][counter2].teacher).indexOf(',') == -1){
                                    newArr[counter][counter2].teacher = data[i].day[counter][counter2].teacher;       
                                }
                                else{
                                    newArr[counter][counter2].teacher = data[i].day[counter][counter2].teacher.slice(0,data[i].day[counter][counter2].teacher.indexOf(','))
                                }
                            }
                            else if ((data[i].day[counter][counter2].teacherF != null) && (data[i].day[counter][counter2].teacherF != undefined)){
                                if (String(data[i].day[counter][counter2].teacherF).indexOf(',') == -1){
                                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF;       
                                }
                                else{
                                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF.slice(0,data[i].day[counter][counter2].teacherF.indexOf(','))
                                }
                            }
                            else if ((data[i].day[counter][counter2].teacherS != null) && (data[i].day[counter][counter2].teacherS != undefined)){
                                if (String(data[i].day[counter][counter2].teacherS).indexOf(',') == -1){
                                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS;       
                                }
                                else{
                                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS.slice(0,data[i].day[counter][counter2].teacherS.indexOf(','))
                                }
                            }
                        }

                        if ((secondNameS == cName)){
                            newArr[counter][counter2].groupS = data[i].class;
                            newArr[counter][counter2].classroomS = secondName;
                            if ((data[i].day[counter][counter2].name != null) && (data[i].day[counter][counter2].name != undefined)){
                                if (data[i].day[counter][counter2].name.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].name = data[i].day[counter][counter2].name;       
                                }
                                else{
                                    newArr[counter][counter2].name = data[i].day[counter][counter2].name.slice(data[i].day[counter][counter2].name.indexOf('п/гр')+5,data[i].day[counter][counter2].length)
                                }
                            }
                            else if ((data[i].day[counter][counter2].nameF != null) && (data[i].day[counter][counter2].nameF != undefined)){
                                if (data[i].day[counter][counter2].nameF.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;       
                                }
                                else{
                                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF.slice(data[i].day[counter][counter2].nameF.indexOf('п/гр')+5,data[i].day[counter][counter2].nameF.length)
                                }
                            }
                            else if ((data[i].day[counter][counter2].nameS != null) && (data[i].day[counter][counter2].nameS != undefined)){
                                if (data[i].day[counter][counter2].nameS.indexOf('п/гр') == -1){
                                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;       
                                }
                                else{
                                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS.slice(data[i].day[counter][counter2].nameS.indexOf('п/гр')+5,data[i].day[counter][counter2].nameS.length)
                                }
                            }

                            if ((data[i].day[counter][counter2].teacher != null) && (data[i].day[counter][counter2].teacher != undefined)){
                                if (String(data[i].day[counter][counter2].teacher).indexOf(',') == -1){
                                    newArr[counter][counter2].teacher = data[i].day[counter][counter2].teacher;       
                                }
                                else{
                                    newArr[counter][counter2].teacher = data[i].day[counter][counter2].teacher.slice(data[i].day[counter][counter2].teacher.indexOf(',')+1,data[i].day[counter][counter2].teacher.length)
                                }
                            }
                            else if ((data[i].day[counter][counter2].teacherF != null) && (data[i].day[counter][counter2].teacherF != undefined)){
                                if (String(data[i].day[counter][counter2].teacherF).indexOf(',') == -1){
                                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF;       
                                }
                                else{
                                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF.slice(data[i].day[counter][counter2].teacherF.indexOf(',')+1,data[i].day[counter][counter2].teacherF.length)
                                }
                            }
                            else if ((data[i].day[counter][counter2].teacherS != null) && (data[i].day[counter][counter2].teacherS != undefined)){
                                if (String(data[i].day[counter][counter2].teacherS).indexOf(',') == -1){
                                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS;       
                                }
                                else{
                                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS.slice(data[i].day[counter][counter2].teacherS.indexOf(',')+1,data[i].day[counter][counter2].teacherS.length)
                                }
                            }
                        }
                    }
                }


                if (data[i].day[counter][counter2].classroom == cName){
                    newArr[counter][counter2] = data[i].day[counter][counter2];
                    newArr[counter][counter2].group = data[i].class;
                }
                if (data[i].day[counter][counter2].classroomF == cName){
                    newArr[counter][counter2].groupF = data[i].class;
                    newArr[counter][counter2].nameF = data[i].day[counter][counter2].nameF;
                    newArr[counter][counter2].teacherF = data[i].day[counter][counter2].teacherF;
                    newArr[counter][counter2].classroomF = data[i].day[counter][counter2].classroomF;
                }
                if (data[i].day[counter][counter2].classroomS == cName){
                    newArr[counter][counter2].groupS = data[i].class;
                    newArr[counter][counter2].nameS = data[i].day[counter][counter2].nameS;
                    newArr[counter][counter2].teacherS = data[i].day[counter][counter2].teacherS;
                    newArr[counter][counter2].classroomS = data[i].day[counter][counter2].classroomS;
                }
            }
        }
    }            

    return newArr
};

module.exports.findGroup = function(data,gName){
    for (i in data){
        if (data[i].class == gName){
            return (data[i])
        }
    }
};

generateErr = function(err){
    result = ''

    if (err.indexOf('6') != -1){
        result = 'В понедельник'
    }

    if (err.indexOf('7') != -1){
        result = 'Во вторник'
    }

    if (err.indexOf('8') != -1){
        result = 'В среду'
    }

    if (err.indexOf('9') != -1){
        result = 'В четверг'
    }

    if (err.indexOf('10') != -1){
        result = 'В пятницу'
    }


    if (err.indexOf('1') != -1){
        result += ' первым уроком'
    }

    if (err.indexOf('2') != -1){
        result += ' вторым уроком'
    }

    if (err.indexOf('3') != -1){
        result += ' третьем уроком'
    }

    if (err.indexOf('4') != -1){
        result += ' четвертым уроком'
    }

    if (err.indexOf('5') != -1){
        result += ' пятым уроком'
    }


    if (err.indexOf('classroom') != -1){
        result += ' несколько классов заняты в одно и тоже время!'
    }

    if (err.indexOf('teacher') != -1){
        result += ' несколько учителей работают в одно и тоже время'
    }

    return result
};

module.exports.addAllTime = function(data,inp){
    arrTime = []
    for (i in data[0].day){
        arrTime.push(data[0].day[0][i].time);        
    }

    for (i in inp){
        for (counter in inp[i]){
            inp[i][counter].time = arrTime[counter]
        }
    }

    return inp
}