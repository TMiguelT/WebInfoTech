var moment = require('moment');
var fs = require('fs');

var select_photos = fs.readFileSync('./api/photo/sql_queries/photo_select_query.sql').toString();
var select_distance = fs.readFileSync('./api/photo/sql_queries/distance_select_query.sql').toString();
var group_photos = fs.readFileSync('./api/photo/sql_queries/photo_group_query.sql').toString();

module.exports = {
    selectAllPhotos: function *(photos, knex) {
        return (yield knex.raw(select_photos + group_photos)).rows;
    },
    selectPhotoById: function *(photo_id, knex) {
        return (yield knex.raw(select_photos + 'WHERE photo.photo_id = ?' + group_photos, [photo_id])).rows[0];
    },
    getGeoToLocation: function *(photo_id, geo, knex) {
        return (yield knex.raw(select_distance, [geo, geo, photo_id])).rows[0].json_build_object;
    },
    addComment: function *(comment, knex) {
        return (yield knex("comment")
                .insert({
                    user_id: comment.comment_content.user_id,
                    photo_id: comment.photo_id,
                    text: comment.comment_content.text,
                    date: comment.comment_content.date_posted,
                })
        );
    },
    deleteComment: function *(comment, knex) {
        return (yield knex("comment")
            .where({
                user_id: comment.user_id,
                date: moment(comment.date_posted).format("YYYY-MM-DD HH:mm:ss")
            })
            .del());
    },
    addLike: function *(like, knex) {
        console.log(like);
        return (yield knex("like")
                .insert({
                user_id: like.user_id,
                photo_id: like.photo_id,
                value: like.value
            }));
    },
    deleteLike: function *(like, knex) {
        return (yield knex("like").where({
            user_id: like.user_id,
            value: like.value
        }).del());
    }
}