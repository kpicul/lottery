const Koa = require("koa");
const Router = require("koa-router");
const koaBody = require('koa-body');
const db = require('./database');
const multer = require('@koa/multer');
var formidable = require('koa2-formidable'); 

const upload = multer();
var app = new Koa();
var router = new Router();

router.get('/hw', (ctx, next) => {
    ctx.body = 'Hello World!';
});

router.post('/ptest', koaBody(), (ctx, next) => {
    console.log(ctx.request.body);
    ctx.body = "sec";
});

router.post('/ticket', koaBody(), async (ctx) => {
    var json = ctx.request.body;
    var error = false;
    if(json.numbers.length != 7){
        ctx.body = errorMessage("There must be 7 numbers");
        error = true;
    }
    for(var i = 0; i < json.numbers.length - 1 ; i++){
        if(json.numbers[i] > 60){
            ctx.body = errorMessage("Numbers can't be bigger than 60");
            error = true;
            break;
        }
        for(var j = i+1; j < json.numbers.length; j++){
            if (json.numbers[i] == json.numbers[j]){
                error = true
                ctx.body = errorMessage("There can't be the same 2 numbers");
                break;
            }
        }
    }
    if(!error){
        var id = await db.insertSingleTicket(json.numbers);
        console.log(id);
        ctx.body = id;
    }
});

router.post('/ticketstat', koaBody(), async (ctx) => {
    var error = false;
    var json = ctx.request.body;
    if (json.numbers.length != 7){
        error = true;
        ctx.body = errorMessage("There must be 7 numbers");
    }
    for(var i = 0; i < json.numbers.length - 1 ; i++){
        if(json.numbers[i] > 60){
            ctx.body = errorMessage("Numbers can't be bigger than 60");
            error = true;
            break;
        }
        for(var j = i+1; j < json.numbers.length; j++){
            if (json.numbers[i] == json.numbers[j]){
                error = true;
                ctx.body = errorMessage("There can't be the same 2 numbers");
                break;
            }
        }
    }
    if(!error){
        var wins = await db.getFreq(json.numbers);
        var keys = Object.keys(wins);
        var result = new Object();
        result['7'] = 0;
        result['6'] = 0;
        result['5'] = 0;
        result['4'] = 0;
        result['3'] = 0;
        result['2'] = 0;
        result['1'] = 0;
        for (var i = 0; i < keys.length; i++){
            //console.log(wins[keys[i]].toString());
            result[wins[keys[i]].toString()]++;
        }
        ctx.body = result;
    }
});

router.get('/numberstat', async(ctx) => {
    var nd = await db.numFreq();
    var slist = [];
    for(var key in nd){
        slist.push([key, nd[key]]);
    }
    slist.sort((a, b) => {
        return b[1] - a[1];
    });
    //console.log(slist);
    var sobj = "{"
    for(var i = 0; i < slist.length; i++){
        //console.log(slist[i]);
        sobj+=slist[i][0]+":"+slist[i][1]+",";
    }
    sobj+="}"
    //console.log(sobj);
    ctx.body = sobj;
});

router.post('/csv', koaBody({ multipart: true,
    json: true,
    formidable: {
        maxFileSize: 5000*1000*1000
    }}), async(ctx, next) => {
    await next();
    var file = ctx.request.files.file;
    await db.csvRead(file.path);
    ctx.body = "{ message: combinations inserted }"
});

function errorMessage(message){
    return "{ 'Error':" + message + " }"
}

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000);