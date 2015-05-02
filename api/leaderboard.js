var router = require('koa-router')();


router
    .get('/all', function *() {
        this.body = yield this.knex('all').where('')
})