var app = require('koa')();
var static = require('koa-static');
var mount = require('koa-mount');

app
  .use(require("./routes/users")) //Mount the users API
  .use(mount("/public", static("public"))); //Mount the static file server
  
  /*
  .use(require(".routes/about"));
  .use(require(".routes/dashboard"));
  .use(require(".routes/photoList"));
  .use(require(".routes/game"));
  .use(require(".routes/takePhoto"));
  .use(require(".routes/leaderboard"));
  */
  
app.listen(3000);
console.log("Listening at port 3000");