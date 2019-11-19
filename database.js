const mysql = require('mysql');

const con = mysql.createPool({
    connectionLimit : 150,
    host: "localhost",
    user: "signapps",
    password: "signapps",
    database: "lottery"
})

function currentDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth()).padStart(2, '0');
    var yyyy = today.getFullYear();
    var hh = String(today.getHours());
    var min = String(today.getMinutes());
    var sec = String(today.getSeconds());
    return dd + '-' + mm + '-' + yyyy + '-' + hh + '-' + min + '-' + sec;
}

function selectSingleNumber(number){
    return new Promise((resolve, reject) => {
        var sql = "SELECT ticket_number.id_ticket FROM ticket_number WHERE number = ?";
        var list = [];
        con.query(sql, number, function(err, result, fields){
            if (err) throw err;
            for(var i = 0; i < result.length; i++){
                list.push(result[i].id_ticket);
            }
            resolve(list)
        });
    });
}


function generateID(){
    return new Promise((resolve, reject) => {
        var crypto = require('crypto');
        var id = crypto.randomBytes(20).toString('hex');
        resolve(id);
    });
}


function insertTicket(ticket){
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO ticket(id_ticket, date_added, time_added) VALUES(?, ?, ?)";
        con.query(sql, ticket, (err) => {
            if (err) reject("Error when inserting ticket " + err);
            console.log("Ticket inserted");
            resolve(true);
        });
    })
}

function insertNumbers(numbers){
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO ticket_number (id_ticket, number) VALUES ?"
        con.query(sql, [numbers], function(err, result){
            if (err) reject("Error when inserting numbers " + err);
            console.log("Number of numbers inserted: " + result.affectedRows);
            resolve(true);
        });
    });
}

function addToDb(ticket, numbers){
    return new Promise(async (resolve, reject) => {
        ticket = await insertTicket(ticket);
        if(ticket){
            numbers = await insertNumbers(numbers);
            if(numbers){
                resolve(true);
            }
            else{
                reject("Error when inserting  "+ numbers);
            }
        }
        else{
            reject("Error when inserting "+ ticket)
        }
    });
}

function returnIntNumbers(rawLine, id){
    return new Promise((resolve, reject) => {
        var rawTable = rawLine.replace('\n').split(',');
        var numbers = [];
        for(var i = 0; i < rawTable.length; i++){
            numbers.push([id, parseInt(rawTable[i])]);
        }
        resolve(numbers);
    });
}

function genTicket(id){
    return new Promise((resolve, reject) =>{
        var today = currentDate().split("-");
        var date = today[2]+"-"+today[1]+"-"+today[0];
        var time = today[3]+":"+today[4]+":"+today[5];
        var ticket = [id, date, time];
        resolve(ticket);
    });
}

function genTicketNA(id){
    var today = currentDate().split("-");
    var date = today[2]+"-"+today[1]+"-"+today[0];
    var time = today[3]+":"+today[4]+":"+today[5];
    var ticket = [id, date, time];
    return ticket;
}
function returnIntNumbersNA(rawLine, id){
    var rawTable = rawLine.replace('\n').split(',');
    var numbers = [];
    for(var i = 0; i < rawTable.length; i++){
        numbers.push([id, parseInt(rawTable[i])]);
    }
    return numbers;
}

function generateNumbersNA(id, numtable){
    var numbers = [];
    for(var i = 0; i < numtable.length; i++){
        numbers.push([id, numtable[i]]);
    }
    return numbers;
}

function readCsv3(url){
    return new Promise(async (resolve, reject) => {
        var lineReader = require('line-reader');
        var i = 0;
        lineReader.eachLine(url, async function(line, last) {
            id = await generateID();
            ticket = genTicketNA(id);
            numbers = returnIntNumbersNA(line, id);
            num = await addToDb(ticket, numbers)
            i++;
            console.log(i);
            if(last){
                resolve(true);
            }
        });
    });
}

function processWinners(list, winners){
    return new Promise((resolve, reject) => {
        for(var j = 0; j < list.length; j++){
            if(winners[list[j]] != undefined){
                winners[list[j]]++
            }
            else{
                winners[list[j]] = 1;
            }
        }
        resolve(winners);
    });
}

function getWinners(combination){
    return new Promise(async (resolve, reject) => {
        var winners = new Object();
        for(var i = 0; i < combination.length; i++){
            var list = await selectSingleNumber(combination[i]);
            winners = await processWinners(list, winners);
        }
        resolve(winners);  
    });
}
function getMore(wins){
    var keys = Object.keys(wins);
    for(var i = 0; i < keys.length; i++){
        if(wins[keys[i]] > 4){
            console.log(wins[keys[i]]);
        }
    }
}

function getNumFrequency(number){
    return new Promise((resolve, reject) => {
        var sql = "SELECT COUNT(ticket_number.number) AS frequency FROM ticket_number WHERE number = ?";
        con.query(sql, number, function(err, result){
            if(err) throw err;
            resolve(result[0].frequency);
        });
    });
}

module.exports = {
    insertSingleTicket: async function(numbers){
        var id = await generateID();
        var ticket = genTicketNA(id);
        var numtable = generateNumbersNA(id, numbers);
        await addToDb(ticket, numtable);
        var retobj = new Object();
        retobj.id = id;
        retobj.date = ticket[1];
        retobj.time = ticket[2];
        retobj.numbers = numbers;
        retobj.message = "Insert succesfull";
        return retobj;
    },

    getFreq: async function(numbers){
        var wins = await getWinners(numbers);
        return wins;
    },

    numFreq: async function(){
        var numfreq = new Object();
        for(var i = 1; i <= 60; i++){
            numfreq[i.toString()] = await getNumFrequency(i);
        }
        return numfreq;
    },
    
    csvRead: async function(url){
        await readCsv3(url);
    }
}
