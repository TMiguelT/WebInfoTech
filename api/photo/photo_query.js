var moment = require('moment');

module.exports = {
    selectAllPhotos: function *(photos, knex) {
        return (yield knex.raw('SELECT image_path, name, description, date_created, num_finds, ST_X(ST_AsText("location")) AS location_lon, ST_Y(ST_AsText("location")) AS location_lat, orientation[0] AS orientation_absolute, orientation[1] AS orientation_alpha, orientation[2] AS orientation_beta, orientation[3] AS orientation_gamma, user_id, photo_id FROM "photo"')).rows;
    },
    selectPhotoById: function *(photo_id, knex) {
        return (yield knex.raw('SELECT image_path, name, description, date_created, num_finds, ST_X(ST_AsText("location")) AS location_lon, ST_Y(ST_AsText("location")) AS location_lat, orientation[0] AS orientation_absolute, orientation[1] AS orientation_alpha, orientation[2] AS orientation_beta, orientation[3] AS orientation_gamma, user_id, photo_id FROM "photo" WHERE photo_id = ?', [photo_id])).rows[0];
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
    }
}