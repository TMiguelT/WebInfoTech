var photoQuery = require('./photo_query');
var photoHelper = require('./photo_helper');
var router = require('koa-router')();
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
        var body_json = {};

        try {
            var elements = yield photoQuery.selectAllPhotos(elements, this.knex);

            elements.forEach(function(element) {
                photoHelper.removeDuplicates(element);
            });

            body_json = elements;
        } catch(e) {
            body_json = { error: String(e) };
            console.error(e);
        }

        this.body = body_json;
    })
    .get('/:photoId', function *() {
        var body_json = {};
        try {
            photo_id = this.params.photoId;

            var element = yield photoQuery.selectPhotoById(photo_id, this.knex);

            photoHelper.removeDuplicates(element);

            body_json = element;
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
    .post('/like/add', function *() {
        this.body = this.request.body;

        try {
            yield photoQuery.addLike(this.body, this.knex);
        } catch(e) {
            console.error("db error: " + e);
        }
    })
    .post('/like/delete', function *() {
        this.body = this.request.body;

        try {
            yield photoQuery.deleteLike(this.body, this.knex);
        } catch(e) {
            console.error("db error: " + e);
        }
    })
    .post('/upload', function *() {

        // must parse some fields to the correct format
        var data = this.request.body.fields;
        var photo = this.request.body.files.photo;

        data.tags = JSON.parse(data["tags"])
        data.position = JSON.parse(data["position"])
        data.orientation = JSON.parse(data["orientation"])

        var time = new Date();
        var suffix = photo.type.split("/")[1]

        //post the photo
        var options = {
            uri: 'http://192.241.210.241/photos',
            method: 'POST',
            formData: {
                photo: fs.createReadStream(photo.path),
                name: data.user_id + "_" + time.getTime() + "." + suffix
            }
        };

        this.body = yield request(options)

        // if photo post is unsuccessful do not continue
        if (this.body != "OK") {
            return;
        }

        // TODO remove this once orientation is functioning
        data.orientation.absolute = 0;

        // insert the photo
        var this_photo_id = yield this.knex("photo").insert({
            "image_path": options.formData.name,
            location: this.knex.raw("ST_GeomFromGeoJSON(?)", {
                'type': "Point", "coordinates": [
                    data.position.longitude,
                    data.position.latitude
                ]
            }),
            orientation: [
                data.orientation.absolute,
                data.orientation.alpha,
                data.orientation.beta,
                data.orientation.gamma
            ],
            "name": data.name,
            "description": data.description,
            "user_id": data.user_id
        }, 'photo_id');


        // insert into tag table
        yield this.knex.raw("INSERT INTO tag (name) SELECT tag_name FROM (SELECT unnest(?::text[]) tag_name) as new WHERE new.tag_name NOT IN (SELECT name FROM tag)", [data.tags])

		//@Andy the first query was working we just needed to add bracket
        //@Michael roger that
        var tag_ids = yield this.knex.raw("SELECT tag_id FROM tag WHERE name = ANY(?)", [data.tags])

        // insert into photo-tag table
        var tags_with_photo_id = []
        
        //@Andy you needed to iterate over the .rows property because you were iterating over the entire result object before
        tag_ids.rows.forEach(function(row){
              tags_with_photo_id.push({tag_id: row.tag_id, photo_id: this_photo_id[0]})
        });
        
        var result = yield this.knex('photo_tag').insert(tags_with_photo_id)
    })
    .get('/upload_session_info', function *() {
        this.body = this.session;
    });

module.exports = router.routes();