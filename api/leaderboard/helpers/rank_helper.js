var _ = require('lodash');

module.exports = {
    order: function(leaderboard) {
        return _.sortByOrder(_.pluck(leaderboard, 'user'), 'score', false);
    }
};