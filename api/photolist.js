var router = require('koa-router')();
var bcrypt = require('bcrypt-as-promised');
var photoUrl = require('./photoUrl');

router

    .post('/search', function *() {
        console.log("ordering by" + this.request.body.orderBy)
    	var query = this.knex('photo')
            .select('image_path',
                'photo.photo_id',
                'photo.name AS name',
                'num_finds',
                'description',
                'username',
                'num_finds',
                this.knex.raw('json_agg(tag.name) AS tags')
                )
            .count('like.value as likes')
            .count('dislike.value as dislikes')
            .limit(10)

            .leftJoin('user','user.user_id', 'photo.user_id')

            .leftJoin('photo_tag', function(){
                this.on('photo.photo_id', '=', 'photo_tag.photo_id')
            })
            .leftJoin('tag', function(){
                this.on('photo_tag.tag_id', '=', 'tag.tag_id')
            })

            .leftJoin('like', function(){
                this.on('photo.photo_id', '=', 'like.photo_id')
                    .on('like.value', '>', 1)
            })
            .leftJoin('like AS dislike', function(){
                this.on('photo.photo_id', '=', 'like.photo_id')
                    .on('like.value', '<', 1)
            })
            .groupBy('photo.photo_id')
            .groupBy('user.username')
            .orderBy(this.request.body.orderBy);

        if(this.request.body.searchBy){
            var searchTerm = "%" + this.request.body.searchBy +  "%";
            query = query.where('photo.name', 'ilike', searchTerm);
        }

        var photos = yield query;

        photos.forEach(function (row) {
            row.image_path = photoUrl.fullUrl(row.image_path)
        });


        this.body = photos;

        this.status = 200;

    })





    

module.exports = router.routes();