var router = require('koa-router')();
var rankHelper = require('./helpers/rank_helper');
var fs = require('fs');
var select_users = fs.readFileSync('./api/leaderboard/sql_queries/user_select_query.sql').toString();


// This API calls the database for the users score and username information
// it then orders the records by score using rankHelper

router
    .get('/world', function *() {
        leaderboard = (yield this.knex.raw(select_users)).rows;

        leaderboard = rankHelper.order(leaderboard);

        this.body = {
            leaderboard: leaderboard
        };

    });


module.exports = router.routes();