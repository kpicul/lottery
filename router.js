const Koa = require("koa");
const Router = require("koa-router");
const koaBody = require('koa-body');
const db = require('./database');

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
    var id = await db.insertSingleTicket(json.numbers);
    console.log(id);
    ctx.body = id;
});

router.post('/ticketstat', koaBody(), async (ctx) => {
    var json = ctx.request.body;
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
});

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000);