const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
router.get('/world', (ctx, next) => {
    ctx.body = 'Hello World 1!';
});
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);