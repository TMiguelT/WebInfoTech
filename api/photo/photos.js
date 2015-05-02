var photoMapper = require('./photo_mapper');
var photoQuery = require('./photo_query');
var router = require('koa-router')();
var co = require('co');
var photoData = require("./photoDummyData.json");
var request = require("request-promise");
var fs = require('fs');

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
    .post('/comment/delete', function *() {
        this.body = this.request.body;

        try {
            yield photoQuery.deleteComment(this.body, this.knex);
        } catch(e) {
            console.error("db error: " + e);
        }
    })
    .post('/upload', function *() {

        // must parse some fields to the correct format
        data = this.request.body.fields
        data["tags"] = JSON.parse(data["tags"])
        data["position"] = JSON.parse(data["position"])
        //this.body = this.request.body;

        //post the photo
        var options = {
            uri: 'http://192.241.210.241/photos',
            method: 'POST',
            formData: {
                photo: fs.createReadStream(this.request.body.files.photo.path),
                name: "test2.png"
            }
        };

        this.body = yield request(options)


        // insert the photo
        // insert the tags
        // insert tag-photo relationships

    })
    .get('/upload_session_info', function *() {
        this.body = this.session;
    });

module.exports = router.routes();