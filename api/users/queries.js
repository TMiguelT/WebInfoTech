//Requires
var photoUrl = require("../photoUrl");

var PHOTOS_PER_PAGE = 10;

module.exports = {

    userIdFromQuery: function (context) {
        var userId;

        if ('userId' in context.request.body)
            userId = context.request.body.userId;
        //Otherwise, if they're logged in, use their id from the session data
        else if (context.session.logged_in)
            userId = context.session.user_id;
        else
            throw new Error("You must be logged in or provide a user ID to access the user page");

        return userId;
    },

    userDataQuery: function (knex, userId) {
        return knex('user')
            .select(
            'user.user_id',
            'username',
            knex.raw('5*COUNT(DISTINCT "like") + 10*COUNT(DISTINCT "find") AS score'),
            knex.raw("count(DISTINCT find) AS num_finds"),
            knex.raw("count(DISTINCT photo) AS num_photos")
        )
            .where({'user.user_id': userId})
            .leftJoin('find', 'find.user_id', '=', 'user.user_id')
            .leftJoin('photo', 'photo.user_id', '=', 'user.user_id')
            .leftJoin('like', 'photo.user_id', '=', 'like.photo_id')
            .groupBy('user.user_id');
    },

    publicUserData: function *(knex, userId) {
        return (yield this.userDataQuery(knex, userId)) [0];
    },

    privateUserData: function *(knex, userId) {
        return (yield this.userDataQuery(knex, userId).select("private", "email")) [0];
    },

    userPhotos: function *(knex, page, userId) {
        var query = knex('photo')
            .select('image_path', 'num_finds')
            .count('like.value as likes')
            .count('dislike.value as dislikes')
            .where({'photo.user_id': userId})
            .leftJoin('like', function () {
                this.on('photo.photo_id', '=', 'like.photo_id')
                    .on('like.value', '>', 1)
            })
            .leftJoin('like AS dislike', function () {
                this.on('photo.photo_id', '=', 'like.photo_id')
                    .on('like.value', '<', 1)
            })
            .groupBy('photo.photo_id')
            .limit(PHOTOS_PER_PAGE)
            .offset(PHOTOS_PER_PAGE * (page - 1));

        return query.map(function (row) {
            row.image_path = photoUrl.fullUrl(row.image_path);
            return row;
        });
    },

    userFinds: function *(knex, page, userId) {
        var query = knex('find')
            .select("date", "image_path")
            .where({"find.user_id": userId})
            .leftJoin('photo', 'photo.photo_id', '=', 'find.photo_id')
            .limit(PHOTOS_PER_PAGE)
            .offset(PHOTOS_PER_PAGE * page);

        return query.map(function (row) {
            row.image_path = photoUrl.fullUrl(row.image_path);
            return row;
        });
    }
};