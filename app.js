var app = require('koa')();
var mount = require('koa-mount');
var send = require('koa-send');
var path = require('path');

var indexFile = path.join(__dirname, 'app/index.html');

app
    .use(require('koa-knex')({
        client: 'pg',
        connection: {
            host     : '192.241.210.241',
            user     : 'postgres',
            password : 'ClusteredBellflower',
            database : 'webinfotech'
        }
    })) //Use the database connection
    .use(require('koa-logger')()) //Log each request
    .use(require('koa-router')(app)) //Use the router top level router
    .use(require('koa-body')()) //Use the form parser
    .use(require('koa-validate')()) //Mount the form validator
    .use(mount("/api", require("./api/users"))) //Mount the users API
    .use(mount("/api", require("./api/photos"))) //Mount the users API
    .use(mount("/public", require('koa-static')("public"))) //Mount the static file server
    .use(function *() { //When the user goes anywhere that's not the api or public, send them the main page
        yield send(this, indexFile);
    });


app.listen(3000);
console.log("Listening at port 3000");