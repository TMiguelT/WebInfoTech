var router = require('koa-router')();
var leaderboardFriendsMockData = require("./mock_data/leaderboardFriendsDummyData.json");
var leaderboardWorldMockData = require("./mock_data/leaderboardWorldDummyData.json");
var fs = require('fs');
var select_users = fs.readFileSync('./api/leaderboard/sql_queries/user_select_query.sql').toString();

router
    .get('/world', function *() {
        this.body = leaderboardWorldMockData;
    })
    .post('/friends', function *() {
        var user_id = this.request.body;

        this.body = leaderboardFriendsMockData;
    });

module.exports = router.routes();