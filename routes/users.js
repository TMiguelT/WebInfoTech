var router = require('koa-router')();

router
  .get('/users', function *(next) {
		this.body = "User page"
  }).post('/login', function *(next) {
		this.body = yield db.query("SELECT * FROM table");
  });
  
module.exports = router.routes();