photoUrl = require('../photoUrl');

module.exports = {
    mapId: function(photo, json) {
        json.id = Number(photo.photo_id);
    },
    mapUrl: function(photo, json) {
        json.url = photoUrl.fullUrl(photo.image_path);
    },
    mapName: function(photo, json) {
        json.name = photo.name;
    },
    mapDescription: function(photo, json) {
        json.description = photo.description;
    },
    mapDatePosted: function(photo, json) {
        json.date_posted = photo.date_created;
    },
    mapFinds: function(photo, json) {
        json.finds = photo.num_finds;
    },
    mapLocation: function(photo, json) {
        json.location = {};
        json.location.coords = {
            latitude: photo.location_lat,
            longitude: photo.location_lon
        };
    },
    mapOrientation: function(photo, json) {
        json.location.orientation = {
            absolute: photo.orientation_absolute,
            alpha: photo.orientation_alpha,
            beta: photo.orientation_beta,
            gamma: photo.orientation_gamma
        };
    },
    mapUser: function *(photo, json, knex) {
        user = (yield knex('user')
            .where({user_id: photo.user_id})
            .select('user_id', 'username'))[0];
        json.user = {};
        json.user.user_id = user.user_id;
        json.user.username = user.username;
    },
    mapTags: function *(photo, json, knex) {
        tags = (yield knex('photo_tag')
            .where({photo_id: photo.photo_id})
            .select('tag_id'))
            json.tags = [];

        for (var j = 0; j < tags.length; j++) {
            json.tags[j] = {};

            tag = (yield knex('tag')
                .where({tag_id: tags[j].tag_id})
                .select('name'))[0];

            json.tags[j].name = tag.name; // need to capitalise
            json.tags[j].url = "/tags/" + tag.name;
        }
    },
    mapComments: function *(photo, json, knex) {
        // comments
        comments = (yield knex('comment')
            .where({photo_id: photo.photo_id})
            .select())
        json.comments = [];

        for (var j = 0; j < comments.length; j++) {
            json.comments[j] = {};

            user = (yield knex('user')
                .where({user_id: comments[j].user_id})
                .select('user_id', 'username'))[0];

            json.comments[j].user_id = user.user_id;
            json.comments[j].username = user.username;
            json.comments[j].date_posted = comments[j].date;
            json.comments[j].text = comments[j].text;
        }
    },
    mapLikes: function *(photo, json, knex) {
        function getNumberOfLikesDislikes(likes, val) {
            sum = 0;

            likes.forEach(function(like) {
                if (like.value === val) sum++;
            })

            return sum;
        }

        likes = (yield knex('like')
            .where({photo_id: photo.photo_id})
            .select('value'));

        json.likes = getNumberOfLikesDislikes(likes, 1);
        json.dislikes = getNumberOfLikesDislikes(likes, -1);
    },
    mapPhoto: function *(photo, photo_json, knex) {
        this.mapId(photo, photo_json);
        this.mapUrl(photo, photo_json);
        this.mapName(photo, photo_json);
        this.mapDescription(photo, photo_json);
        this.mapDatePosted(photo, photo_json);
        this.mapFinds(photo, photo_json);
        this.mapLocation(photo, photo_json);
        this.mapOrientation(photo, photo_json);

        yield this.mapUser(photo, photo_json, knex);

        yield this.mapTags(photo, photo_json, knex);

        yield this.mapComments(photo, photo_json, knex);

        yield this.mapLikes(photo, photo_json, knex);
    }
};