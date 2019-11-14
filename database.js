var mysql = require('mysql');

var con = mysql.createConnection({
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

function generateID(){
    var crypto = require('crypto');
    var id = crypto.randomBytes(20).toString('hex');
    return id;
}

function insertTicketNumber(id, number, con){
    var sql = "INSERT INTO ticket_number (id_ticket, number) VALUES (?, ?)";
    var values = [id, number];
    con.query(sql, values, function(err, _){
        if (err) throw err;
        //console.log(number);
    });
}

function insertTicket(numbers, con){
    con.connect(function(err){
        var today = currentDate().split('-');
        var sql = `INSERT INTO ticket(id_ticket, date_added, time_added) VALUES (?, ?, ?)`;
        var id = generateID();
        var date = today[2]+'-'+today[1]+'-'+today[0];
        var time = today[3]+':'+today[4]+':'+today[5]
        var values = [id, date, time];
        con.query(sql, values, function(err, result){
            if(err) throw err;
            //console.log("Insert into ticket successfull!");
        });
        for(var i = 0; i < numbers.length; i++){
            insertTicketNumber(id, numbers[i], con);
        }
        //console.log("Ticket inserted successfully!");
    });
}

function insertMultTickets(con, tickets){
    /*con.connect(function(err){
        if(err) throw err;
    });*/
    var sql = "INSERT INTO ticket(id_ticket, date_added, time_added) VALUES ?";
    con.query(sql, [tickets], function(err, result){
        if (err) throw err;
        //console.log("Number of records inserted: " + result.affectedRows);
    });
    //con.end();
    
}

function insertMultNums(con, numbers){
    var sql = "INSERT INTO ticket_number (id_ticket, number) VALUES ?"
    con.query(sql, [numbers], function(err, result){
        if (err) throw err;
        //console.log("Number of records inserted: " + result.affectedRows);
    });
}

function readCsv2(url, con){
    var j = 1;
    var ticketRaw = [];
    var lineReader = require('line-reader');
    var tickets = [];
    var numbers = [];
    lineReader.eachLine(url, function(line, last) {
        ticketRaw = line.replace('\n', '').split(',');
        var idTicket = generateID();
        var today = currentDate().split('-');
        var date = today[2]+'-'+today[1]+'-'+today[0];
        var time = today[3]+':'+today[4]+':'+today[5]
        var values = [idTicket, date, time];
        tickets.push(values);
        for(var i = 0; i < ticketRaw.length; i++){
            numbers.push([idTicket, parseInt(ticketRaw[i])])
        }
        console.log(ticketRaw+":"+j);
        if(j % 10000 == 0){
            insertMultTickets(con, tickets,() => {
                insertMultNums(con, numbers, () =>{
                    console.log(tickets);
                });
            });
            tickets = [];
            numbers = [];
        }
        j++;
    });
}

//readCsv("/home/kristjan/naloga_signapps/wetransfer-4bbb14/loterija/lottery.csv", con);
//insertTicket([1, 2, 3, 4, 5, 6, 7], con);
readCsv2("/home/kristjan/naloga_signapps/wetransfer-4bbb14/loterija/lottery.csv", con);
/*var tickets = [
    ["asdasd", "2011-05-06", "13:15:12"],
    ["aasdfs", "2013-02-06", "11:19:32"],
    ["ascxycas", "2014-12-07", "22:19:52"]
];

insertMultTickets(con, tickets);*/
