var router = require('koa-router')();

router
    //These are two different ways of performing the same query
    .get('/tags', function *() {
        this.body = yield this.knex('tag').where('tag_id', '>', 1);
    })
    .get('/tags_raw', function *() {
        this.body = (yield this.knex.raw('SELECT * FROM tag WHERE tag_id > ?', [1])).rows;
    });

module.exports = router.routes();