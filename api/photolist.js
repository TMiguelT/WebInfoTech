var router = require('koa-router')();
var bcrypt = require('bcrypt-as-promised');
var photoUrl = require('./photoUrl');

router

    .post('/search:orderBy&:search', function *() {
               
            var searchTerm = "%" + this.params.search +  "%";
    
            console.log(searchTerm);
			var query = this.knex('photo')
                .select('image_path','photo.photo_id','photo.name AS name','num_finds','description','username')
                .limit(10)
                .leftJoin('user','user.user_id', 'photo.user_id')

                .leftJoin('photo_tag', function(){
                    this.on('photo.photo_id', '=', 'photo_tag.photo_id')
                })
              .leftJoin('tag', function(){
                    this.on('photo_tag.tag_id', '=', 'tag.tag_id')
                })

            .where('photo.name', 'like', searchTerm)
            .groupBy('photo.photo_id')
            .groupBy('user.username')
            .orderBy(this.params.orderBy);

            var photos = yield query;

            photos.forEach(function (row) {
                row.image_path = photoUrl.fullUrl(row.image_path)
            });
    
            //Probably need to improve this query 
            for (index = 0; index < photos.length; ++index) {
                photos[index].tags = yield this.knex('tag')
                    .select('tag.name')
                    .leftJoin('photo_tag','photo_tag.tag_id','tag.tag_id')
                    .where('photo_tag.photo_id', photos[index].photo_id);

            };
    
            this.body = photos;

            this.status = 200;

    })

    .post('/order:orderBy', function *() {
            
            var query = this.knex('photo')
                .select('image_path','photo.photo_id','photo.name AS name','num_finds','description','username')
                .limit(10)
                .leftJoin('user','user.user_id', 'photo.user_id')

                .leftJoin('photo_tag', function(){
                    this.on('photo.photo_id', '=', 'photo_tag.photo_id')
                })
              .leftJoin('tag', function(){
                    this.on('photo_tag.tag_id', '=', 'tag.tag_id')
                })

            .groupBy('photo.photo_id')
            .groupBy('user.username')
            .orderBy(this.params.orderBy);

            var photos = yield query;

            photos.forEach(function (row) {
                row.image_path = photoUrl.fullUrl(row.image_path)
            });
    
            //Probably need to improve this query 
            for (index = 0; index < photos.length; ++index) {
                photos[index].tags = yield this.knex('tag')
                    .select('tag.name')
                    .leftJoin('photo_tag','photo_tag.tag_id','tag.tag_id')
                    .where('photo_tag.photo_id', photos[index].photo_id);

            };
    
            this.body = photos;

            this.status = 200;

    });




    

module.exports = router.routes();