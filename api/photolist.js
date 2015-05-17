var router = require('koa-router')();
var bcrypt = require('bcrypt-as-promised');
var photoUrl = require('./photoUrl');

router

    .post('/search', function *() {
        
        var test_location = '{"type":"Point","coordinates":[-48.23456,20.12345]}';

        if (this.request.body.coords){
            var geo = {
                type: "Point",
                coordinates: [
                    parseFloat(this.request.body.coords.longitude),
                    parseFloat(this.request.body.coords.latitude)
                ]
            };
        }


    	var query = this.knex('photo')
            .select('image_path',
                'photo.photo_id',
                'photo.name AS name',
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

            .offset(this.request.body.rows)

            .limit(this.request.body.photosPerPage);


            if (this.request.body.coords){
                var geo = {
                    type: "Point",
                    coordinates: [
                        parseFloat(this.request.body.coords.longitude),
                        parseFloat(this.request.body.coords.latitude)
                    ]
                };

            query = query.select(this.knex.raw('ST_Distance(photo.location, ST_GeomFromGeoJSON(?)) AS distance', [geo]));

            }

            // Order By 
            if(this.request.body.orderBy == 'Name'){
                var ordername = 'name';
            }

            else if(this.request.body.orderBy == 'User'){
                var ordername = 'username';
            }

            else if(this.request.body.orderBy == 'Distance'){
                var ordername = 'distance';
            }

            else if(this.request.body.orderBy == 'Description'){
                var ordername = 'description';
            }
            else if(this.request.body.orderBy == 'Likes'){
                var ordername = 'like';
            }

            query = query.orderBy(ordername)


            // Search in the right table 
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
            
            // If searchterm is provided, only return those photos
            if(this.request.body.searchBy){
                var searchTerm = "%" + this.request.body.searchBy +  "%";
                query = query.where(tablename, 'ilike', searchTerm);
            }

            // Execute query
            var photos = yield query;
            
            // Fix the photo URl and the distance to integers
            photos.forEach(function (row) {
                row.image_path = photoUrl.fullUrl(row.image_path)
                row.distance = Math.round(row.distance)/1000;
            });


  
        
        this.body = photos;

        this.status = 200;

    }



    )

    


    

module.exports = router.routes();