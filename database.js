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

function selectSingleNumber(number,con){
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

function returnResult(result){
    console.log(result);
}

function generateID(){
    return new Promise((resolve, reject) => {
        var crypto = require('crypto');
        var id = crypto.randomBytes(20).toString('hex');
        resolve(id);
    });
}


function insertTicket(ticket, con){
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO ticket(id_ticket, date_added, time_added) VALUES(?, ?, ?)";
        con.query(sql, ticket, (err) => {
            if (err) throw err;
            console.log("Ticket inserted");
            resolve([]);
        });
    })
}


function insertMultTickets(tickets, con){
    return new Promise((resolve, reject) => {
            var sql = "INSERT INTO ticket(id_ticket, date_added, time_added) VALUES ?";
            con.query(sql, [tickets], function(err, result){
                if (err) throw err;
                console.log("Number of tickets inserted: " + result.affectedRows)
                tickets = [];
                resolve([]);
                //;
            });
        }
    );
    //con.end();
    
}

function insertNumbers(numbers, con){
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO ticket_number (id_ticket, number) VALUES ?"
        con.query(sql, [numbers], function(err, result){
            if (err) throw err + numbers;
            console.log("Number of numbers inserted: " + result.affectedRows);
            resolve([]);
            //console.log("Number of records inserted: " + result.affectedRows);
        });
    });
}

function addToDb(ticket, numbers, con){
    return new Promise(async (resolve, reject) => {
        ticket = await insertTicket(ticket, con);
        numbers = await insertNumbers(numbers, con);
        resolve(true);
    });
}

function addToDbMul(tickets, numbers, con){
    return new Promise(async (resolve, reject) => {
        ticket = await insertMultTickets(tickets, con);
        numbers = await insertNumbers(numbers, con);
        resolve([[],[]]);
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

async function slowReader(line ,last){
    return new Promise(async (resolve, reject) => {
        id = await generateID();
        ticket = await genTicket(id);
        numbers = await returnIntNumbers(line, id);
        num = await addToDb(ticket, numbers, con)
        resolve(num);
    });
}

function readCsv(url, con){
    var lineReader = require('line-reader');
    var i = 0;
    lineReader.eachLine(url, async function(line, last) {
        id = await generateID();
        ticket = await genTicket(id);
        numbers = await returnIntNumbers(line, id);
        num = await addToDb(ticket, numbers, con)
        i++;
        console.log(i);
    });
}

function readCsv2(url, con){
    var lineReader = require('line-reader');
    let tickets = [];
    let numbers = [];
    lineReader.eachLine(url, async function(line, last) {
        id = await generateID();
        tickets.push(await genTicket(id));
        var nums = await returnIntNumbers(line, id);
        for(var i = 0; i < nums.length; i++){
            numbers.push(nums[i]);
        }
        if(tickets.length % 10000 == 0 && tickets.length != 0){
            await addToDbMul(tickets, numbers, con);
        }
    });
}

function readCsv3(url, con){
    var lineReader = require('line-reader');
    var i = 0;
    lineReader.eachLine(url, async function(line, last) {
        id = await generateID();
        ticket = genTicketNA(id);
        numbers = returnIntNumbersNA(line, id);
        num = await addToDb(ticket, numbers, con)
        i++;
        console.log(i);
    });
}

async function awaitInsert(con){
    id = await generateID()
    ticket = await genTicket(id);
    await insertTicket(ticket, con);
}

async function getResult(con){
    console.log(await selectSingleNumber(7, con));
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

function getWinners(combination, con){
    return new Promise(async (resolve, reject) => {
        var winners = new Object();
        for(var i = 0; i < combination.length; i++){
            var list = await selectSingleNumber(combination[i], con);
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

function getNumFrequency(number, con){
    return new Promise((resolve, reject) => {
        var sql = "SELECT COUNT(ticket_number.number) AS frequency FROM ticket_number WHERE number = ?";
        con.query(sql, number, function(err, result){
            if(err) throw err;
            resolve(result[0].frequency);
        });
    });
}

async function getWins(){
    var win = await getWinners([1, 2, 3, 4, 5, 60, 57], con);
    getMore(win);
    //console.log(win);
}
//readCsv("/home/kristjan/naloga_signapps/wetransfer-4bbb14/loterija/lottery.csv", con);

getNumFrequency(7, con)
//console.log(5 > 3);