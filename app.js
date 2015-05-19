//Requires

//app is an instance of a Koa server.
//Koa uses generators to allow you to yield asynchronous functions instead of using callbacks
var app = require('koa')();
var mount = require('koa-mount');
var send = require('koa-send');
var path = require('path');
var session = require('koa-generic-session');
var PgStore = require('koa-pg-session');

//Constants

//The full file path of the index.html file
const indexFile = path.join(__dirname, 'app/index.html');
//The database connecion parameters
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

    //Compress everything
    .use(require('koa-gzip')()) 
    
    //Error logging
    .use(function *(next) {
        try {
            yield next;
        }
        catch (ex) {
            console.log(ex.stack);
        }
    }) 
    
    //Make a database connection accessible to all routes
    .use(require('koa-knex')(dbInfo)) 
    
    //Use sessions using Michael's custom postgres session library
    .use(session({
        store: new PgStore(dbInfo.connection)
    })) 
    
    //Log each request to stdout
    .use(require('koa-logger')()) 
    
    //Parse forms (multipart, json, urlencoded etc.)
    .use(require('koa-body')({
        multipart: true,
        formLimit: "50mb"
    })) 
    
    //Mount the form validator that can be used by any route
    .use(require('koa-validate')()) 
    
     //Mount the users API
    .use(mount("/api/user", require("./api/users/users")))
    
    //Mount the leaderboard API
    .use(mount("/api/leaderboard", require("./api/leaderboard/leaderboard")))
    
    //Mount the photos API
    .use(mount("/api/photo", require("./api/photo/photos"))) 
    
    //Mount the photolist API
    .use(mount("/api/photolist", require("./api/photolist"))) 
    
    //Mount the static file server
    .use(mount("/public", require('koa-static')("public"))) 
    
    //When the user goes anywhere that's not the api or public, send them the main page
    .use(function *() { 
        yield send(this, indexFile);
    });


//Listen at port 80!
app.listen(80);
console.log("Listening at port 80");