var photoQuery = require('./queries/photo_query');
var photoHelper = require('./helpers/photo_helper');
var geoHelper = require('./helpers/geo_helper');
var router = require('koa-router')();
var photoData = require("./mock_data/photoDummyData.json");
var request = require("request-promise");
var fs = require('fs');

router

/**
 * GET /photo/all_mock
 *
 * Displays mock data of photos as a JSON endpoint
 *
 */
    .get('/all_mock', function *(next) {
        this.body = {
            photos: photoData
        };
    })

/**
 * GET /photo/all
 *
 * Displays all the photos as a JSON endpoint
 */
    .get('/all', function *() {
        var body_json = {};

        try {
            // Make a call to the database to select all the photos
            var elements = yield photoQuery.selectAllPhotos(elements, this.knex);

            // Remove all the duplicates from the records.
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

/**
 * GET /photo/:photoId
 *
 * Displays photo information for a given photo as a JSON endpoint
 */
    .get('/:photoId', function *() {
        var body_json = {};
        try {
            var photo_id = this.params.photoId;

            var element = yield photoQuery.selectPhotoById(photo_id, this.knex);

            photoHelper.removeDuplicates(element);

            body_json = element;
        } catch(e) {
            body_json = { error: String(e) };
            console.error(e);
        }

        this.body = body_json;
    })

/**
 * POST /photo/distance
 *
 * Displays the distance, direction and a random coordinate within a given radius
 * to the photo as a JSON endpoint.
 */
    .post('/distance', function *() {
        // Set up the GeoJSON
        var geo = {
            type: "Point",
            coordinates: [
                parseFloat(this.request.body.longitude),
                parseFloat(this.request.body.latitude)
            ]
        };

        // Set the photo ID to a variable
        var photo_id = this.request.body.photo_id;

        try {
            var element = yield photoQuery.getGeoToLocation(photo_id, geo, this.knex);
            this.body = {
                distance: element.distance,
                direction: element.direction,
                random_coord: geoHelper.getRandomRadiusCenter(element.location[1], element.location[0], 100)
            };
        } catch(e) {
            console.error(e);
        }
    })

/**
 * POST /photo/comment/add
 *
 * Adds a comment to the photo
 */
    .post('/comment/add', function *() {
        this.body = this.request.body;

        try {
            yield photoQuery.addComment(this.body, this.knex);
        } catch(e) {
            console.error("db error: " + e);
        }
    })

/**
 * POST /photo/comment/delete
 *
 * Deletes a comment from the photo
 */
    .post('/comment/delete', function *() {
        this.body = this.request.body;

        try {
            yield photoQuery.deleteComment(this.body, this.knex);
        } catch(e) {
            console.error("db error: " + e);
        }
    })

/**
 * POST /photo/like/add
 *
 * Adds a like to the photo
 */
    .post('/like/add', function *() {
        this.body = this.request.body;

        try {
            yield photoQuery.addLike(this.body, this.knex);
        } catch(e) {
            console.error("db error: " + e);
        }
    })

/**
 * POST /photo/like/delete
 *
 * Deletes a like from a photo
 */
    .post('/like/delete', function *() {
        this.body = this.request.body;

        try {
            yield photoQuery.deleteLike(this.body, this.knex);
        } catch(e) {
            console.error("db error: " + e);
        }
    })

/**
 * POST /photo/find/add
 *
 * Adds a find to a photo
 */
    .post('/find/add', function *() {
        this.body = this.request.body;

        try {
            yield photoQuery.addFind(this.body, this.knex);
        } catch(e) {
            console.error("db error: " + e);
        }
    })

/**
 * /photo/upload
 *
 * Uploads a photo
 */
    .post('/upload', function *() {

        // must parse some fields to the correct format
        var data = this.request.body.fields;
        var photo = this.request.body.files.photo;

        //data.description = JSON.parse(data["description"])
        data.tags = JSON.parse(data["tags"])
        data.position = JSON.parse(data["position"])
        data.orientation = JSON.parse(data["orientation"])

        if (data.description == "undefined") {
            data.description = null;
        }

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

        var response = yield request(options)

        // if photo post is unsuccessful do not continue
        if (response != "OK") {
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

        this.body = this_photo_id;

        if (data.tags.length > 0) {
            var args = data.tags.map(function (tag) {
                return "(?)"
            }).join(", ")

            // insert into tag table
            yield this.knex.raw("INSERT INTO tag (name) SELECT column1 FROM (VALUES " +
            args +
            ") as new WHERE new.column1 NOT IN (SELECT name FROM tag)", data.tags)

            //@Andy the first query was working we just needed to add bracket
            //@Michael roger that
            var tag_ids = yield this.knex.raw("SELECT tag_id FROM tag WHERE name = ANY(?)", [data.tags])

            // insert into photo-tag table
            var tags_with_photo_id = []

            //@Andy you needed to iterate over the .rows property because you were iterating over the entire result object before
            tag_ids.rows.forEach(function (row) {
                tags_with_photo_id.push({tag_id: row.tag_id, photo_id: this_photo_id[0]})
            });
            var result = yield this.knex('photo_tag').insert(tags_with_photo_id)
        }
    })
    .get('/upload_session_info', function *() {
        this.body = this.session;
    });

module.exports = router.routes();