var {JsonDB} = require('node-json-db');
var {Config} = require('node-json-db/dist/lib/JsonDBConfig');


var db = new JsonDB(new Config("myDataBase", true, false, '/'));

db.push("/arraytest/lastItemArray", [1, 2, 3], true);
