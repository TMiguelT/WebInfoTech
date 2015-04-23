module.exports = {
    selectAllPhotos: function *(photos, knex) {
        return (yield knex.raw('SELECT image_path, name, description, date_created, num_finds, ST_X(ST_AsText("location")) AS location_lon, ST_Y(ST_AsText("location")) AS location_lat, ST_X(ST_AsText("orientation")) AS orientation_alpha, ST_Y(ST_AsText("orientation")) AS orientation_beta, user_id, photo_id FROM "photo"')).rows;
    }
}