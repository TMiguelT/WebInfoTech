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
                photo_json = {};

                yield photoMapper.mapPhoto(photos[i], photo_json, this.knex);

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

            yield photoMapper.mapPhoto(photo, body_json, this.knex)
        } catch(e) {
            body_json = { error: String(e) };
            console.error(e);
        }

        this.body = body_json;
    })
    .post('/comment/add', function *() {
        this.body = this.request.body;

        try {
            yield photoQuery.addComment(this.body, this.knex);
        } catch(e) {
            console.error("db error: " + e);
        }
    })
    .post('/upload', function *() {
        this.body = this.request.body;

        data = this.request.body.fields
        data["tags"] = JSON.parse(data["tags"])
        data["position"] = JSON.parse(data["position"])

    })
    .get('/upload_session_info', function *() {
        this.body = this.session;
    });

module.exports = router.routes();