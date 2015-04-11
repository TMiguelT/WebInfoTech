var router = require('koa-router')();
var photoData = require("./photoDummyData.json");

router
    .get('/photos', function *(next) {
        this.body = {
            photos: photoData
        };
    })
    .post('/upload', function *() {
            var form = this.request.body;
            this.body = {

                form: form

            };
    });


module.exports = router.routes();