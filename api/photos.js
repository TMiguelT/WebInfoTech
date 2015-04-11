var router = require('koa-router')();
var photoData = require("./photoDummyData.json");

router
    .get('/photos', function *(next) {
        this.body = {
            photos: photoData
        };
    }
);

module.exports = router.routes();