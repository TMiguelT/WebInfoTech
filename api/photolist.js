var router = require('koa-router')();
var bcrypt = require('bcrypt-as-promised');
var photoUrl = require('./photoUrl');

router

    .post('/search', function *() {
        console.log('Rows: ' + this.request.body.rows + "Photos per Page: " + this.request.body.photosPerPage + "Seach: " + this.request.body.searchBy);

        var geo = this.knex('')

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
            .orderBy(this.request.body.orderBy)
            .offset(this.request.body.rows)
            .limit(this.request.body.photosPerPage);


        if(this.request.body.searchMode == "Name"){
            var tablename = 'photo.name';
        }

        else if(this.request.body.searchMode == "Description"){
            var tablename = 'photo.description';
        }
        else if(this.request.body.searchMode == "User"){
            var tablename = 'user.username';
        }
        else if(this.request.body.searchMode == "Tag"){
            var tablename = 'tag.name';
        }

        if(this.request.body.searchBy){
            var searchTerm = "%" + this.request.body.searchBy +  "%";
            query = query.where(tablename, 'ilike', searchTerm);
        }

        var photos = yield query;

        photos.forEach(function (row) {
            row.image_path = photoUrl.fullUrl(row.image_path)
        });


        //var location = '{"type":"Point","coordinates":[-48.23456,20.12345]}';
        //var dist_query = this.knex.raw('SELECT ST_AsText(ST_GeomFromGeoJSON(?)) As distance FROM photo',[location]);
        //var distance_photos = yield dist_query;

        //distance_photos.forEach(function (row) {
            //console.log(row.distance);
        //});
        
        this.body = photos;

        this.status = 200;

    }



    )

    


    

module.exports = router.routes();