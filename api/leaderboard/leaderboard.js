var router = require('koa-router')();
var leaderboardFriendsMockData = require("./mock_data/leaderboardFriendsDummyData.json");
var leaderboardWorldMockData = require("./mock_data/leaderboardWorldDummyData.json");
var fs = require('fs');
var select_users = fs.readFileSync('./api/leaderboard/sql_queries/user_select_query.sql').toString();



router
    .get('/world', function *() {
        this.body = {
            leaderboard: (yield this.knex.raw(select_users)).rows
        }
    });


module.exports = router.routes();