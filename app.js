var app = require('koa')();
var mount = require('koa-mount');
var send = require('koa-send');
var path = require('path');
var session = require('koa-generic-session');
var PgStore = require('koa-pg-session');

const indexFile = path.join(__dirname, 'app/index.html');
const dbInfo = {
    client: 'pg',
    connection: {
        host: '192.241.210.241',
        user: 'postgres',
        password: 'ClusteredBellflower',
        database: 'webinfotech'
    }
};

//Used for sessions or something
app.keys = ["edrye5t34rt34erdfgv"];

app
    .use(require('koa-gzip')()) //compress everything
    .use(function *(next) {
        try {
            yield next;
        }
        catch (ex) {
            console.trace(ex);
        }
    }) //Error logging
    .use(require('koa-knex')(dbInfo)) //Use the database connection
    .use(session({
        store: new PgStore(dbInfo.connection)
    })) //Use sessions
    .use(require('koa-logger')()) //Log each request
    .use(require('koa-body')({
        multipart: true,
        formLimit: "50mb"
    })) //Use the form parser
    .use(require('koa-validate')()) //Mount the form validator
    .use(mount("/api/user", require("./api/users/users"))) //Mount the users API
    .use(mount("/api/leaderboard", require("./api/leaderboard/leaderboard"))) //Mount the leaderboard API
    .use(mount("/api/photo", require("./api/photo/photos"))) //Mount the users API
    .use(mount("/api/photolist", require("./api/photolist"))) //Mount the photolist API
    .use(mount("/public", require('koa-static')("public"))) //Mount the static file server
    .use(function *() { //When the user goes anywhere that's not the api or public, send them the main page
        yield send(this, indexFile);
    });


app.listen(3000);
console.log("Listening at port 3000");