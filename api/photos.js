var router = require('koa-router')();
var photoData = require("./photoDummyData.json");

router
    .get('/photos', function *(next) {
        this.body = {
            photos: photoData
        };
    })
    .post('/upload', function *() {
        this.body = this.request.body;
    });

module.exports = router.routes();