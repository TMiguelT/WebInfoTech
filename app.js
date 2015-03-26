var app = require('koa')();

app
  .use(require("./routes/users"));
  /*
  .use(require(".routes/about"));
  .use(require(".routes/dashboard"));
  .use(require(".routes/photoList"));
  .use(require(".routes/game"));
  .use(require(".routes/takePhoto"));
  .use(require(".routes/leaderboard"));
  */
app.listen(3000);