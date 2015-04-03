var app = require('koa')();
var static = require('koa-static');
var mount = require('koa-mount');
var router = require('koa-router');
var send = require('koa-send');
var logger = require('koa-logger');
var path = require('path');
var knex = require('koa-knex');

var indexFile = path.join(__dirname, 'app/index.html');

app
    .use(knex({
        client: 'pg',
        connection: {
            host     : '192.241.210.241',
            user     : 'postgres',
            password : 'ClusteredBellflower',
            database : 'webinfotech'
        }
    })) //Use the database connection
    .use(logger()) //Log each request
    .use(router(app)) //Use the router top level router
    .use(mount("/api", require("./api/users"))) //Mount the users API
    .use(mount("/api", require("./api/photos"))) //Mount the users API
 // .use(mount("/api", require("./api/about"))) //Mount the about page API
    .use(mount("/public", static("public"))) //Mount the static file server
    .get('/:id?', function *(next) {
        yield send(this, indexFile); //When the user goes anywhere that's not the api or public, send them the main page
    });


/*
 .use(require(".api/about"));
 .use(require(".api/dashboard"));
 .use(require(".api/photoList"));
 .use(require(".api/game"));
 .use(require(".api/takePhoto"));
 .use(require(".api/leaderboard"));
 */

app.listen(3000);
console.log("Listening at port 3000");