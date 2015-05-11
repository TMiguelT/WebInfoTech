var _ = require('lodash');

module.exports = {
    removeDuplicates: function(element) {
        element.photo.user = _.uniq(element.photo.user, 'user_id')[0];
        element.photo.tags = _.uniq(element.photo.tags, 'name');
        element.photo.comments = _.uniq(element.photo.comments, 'date_posted');
        element.photo.likes = _.uniq(element.photo.likes, 'user_id');
        _.remove(element.photo.comments, {'user_id' : null});
        _.remove(element.photo.likes, {'user_id' : null});
        _.remove(element.photo.tags, {'name' : null});
    }
}