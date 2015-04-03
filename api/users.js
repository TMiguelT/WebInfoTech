var router = require('koa-router')();

router
    //These are two different ways of performing the same query
    .post('/register', function *() {
        this.body = yield this.knex('tag').where('tag_id', '>', 1);
    });

module.exports = router.routes();