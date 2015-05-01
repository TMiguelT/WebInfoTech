module.exports = {
    selectAllPhotos: function *(photos, knex) {
        return (yield knex.raw('SELECT image_path, name, description, date_created, num_finds, ST_X(ST_AsText("location")) AS location_lon, ST_Y(ST_AsText("location")) AS location_lat, ST_X(ST_AsText("orientation")) AS orientation_alpha, ST_Y(ST_AsText("orientation")) AS orientation_beta, user_id, photo_id FROM "photo"')).rows;
    },
    selectPhotoById: function *(photo_id, knex) {
        return (yield knex.raw('SELECT image_path, name, description, date_created, num_finds, ST_X(ST_AsText("location")) AS location_lon, ST_Y(ST_AsText("location")) AS location_lat, ST_X(ST_AsText("orientation")) AS orientation_alpha, ST_Y(ST_AsText("orientation")) AS orientation_beta, user_id, photo_id FROM "photo" WHERE photo_id = ?', [photo_id])).rows[0];
    },
    addComment: function*(comment, knex) {
        return (yield knex("comment")
                .insert({
                    user_id: comment.comment_content.user_id,
                    photo_id: comment.photo_id,
                    text: comment.comment_content.text,
                    date: comment.comment_content.date_posted,
                })
        );
    }
}