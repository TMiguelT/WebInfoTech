var photoMapper = require('./photo_mapper');
var photoQuery = require('./photo_query');
var router = require('koa-router')();
var co = require('co');
var photoData = require("./photoDummyData.json");

router
    .get('/all_mock', function *(next) {
        this.body = {
            photos: photoData
        };
    })
    .get('/all', function *() {
        try {
            body_json = {photos: []};

            var photos = yield photoQuery.selectAllPhotos(photos, this.knex);

            for (var i = 0; i < photos.length; i++) {
                photo_json = {}

                photoMapper.mapId(photos[i], photo_json);
                photoMapper.mapUrl(photos[i], photo_json);
                photoMapper.mapName(photos[i], photo_json);
                photoMapper.mapDescription(photos[i], photo_json);
                photoMapper.mapDatePosted(photos[i], photo_json);
                photoMapper.mapFinds(photos[i], photo_json);
                photoMapper.mapLocation(photos[i], photo_json);
                photoMapper.mapOrientation(photos[i], photo_json);

                yield photoMapper.mapUser(photos[i], photo_json, this.knex);

                yield photoMapper.mapTags(photos[i], photo_json, this.knex);

                yield photoMapper.mapComments(photos[i], photo_json, this.knex);

                yield photoMapper.mapLikes(photos[i], photo_json, this.knex);

                body_json.photos.push(photo_json);
            };
        } catch(e) {
            body_json = { error: String(e) };
            console.error(e);
        }

        this.body = body_json;
    })
    .get('/:photoId', function *() {
        try {
            body_json = {};
            photo_id = this.params.photoId;

            var photo = yield photoQuery.selectPhotoById(photo_id, this.knex);

            photo_json = {}

            photoMapper.mapId(photo, photo_json);
            photoMapper.mapUrl(photo, photo_json);
            photoMapper.mapName(photo, photo_json);
            photoMapper.mapDescription(photo, photo_json);
            photoMapper.mapDatePosted(photo, photo_json);
            photoMapper.mapFinds(photo, photo_json);
            photoMapper.mapLocation(photo, photo_json);
            photoMapper.mapOrientation(photo, photo_json);

            yield photoMapper.mapUser(photo, photo_json, this.knex);

            yield photoMapper.mapTags(photo, photo_json, this.knex);

            yield photoMapper.mapComments(photo, photo_json, this.knex);

            yield photoMapper.mapLikes(photo, photo_json, this.knex);

            body_json = photo_json;
        } catch(e) {
            body_json = { error: String(e) };
            console.error(e);
        }

        this.body = body_json;
    })
    .post('/upload', function *() {
        this.body = this.request.body;
    })
    .get('/upload_session_info', function *() {
        this.body = this.session;
    });

module.exports = router.routes();