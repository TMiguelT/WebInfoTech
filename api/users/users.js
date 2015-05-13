var router = require('koa-router')();
var bcrypt = require('bcrypt-as-promised');
var photoUrl = require('./../photoUrl');

router
    .post('/login', function *() {
        var form = this.request.body;
        var user;

        //Validate parameters
        this.checkBody('email').notEmpty();
        this.checkBody('password').notEmpty();
        if (this.errors) {
            this.status = 400;
            this.body = this.errors;
            return;
        }

        //Try to get the user
        try {
            user = (yield this
                .knex('user')
                .select()
                .where({
                    email: form.email
                }))[0];
        }

            //If there's an error (no such email) throw an error
        catch (e) {
            this.status = 400;
            this.body = e.message;
            return;
        }

        //Verify password
        var pwMatches = false;
        try {
            pwMatches = yield bcrypt.compare(form.password, user.password);
        }
        catch (e) {
            pwMatches = false;
        }
        if (!pwMatches) {
            this.status = 400;
            this.body = "Invalid password!";
            return;
        }

        //If everything is k, log them in
        this.session.logged_in = true;
        this.session.user_id = user.user_id;
        this.session.username = user.username;
        this.session.email = user.email;

        //And return the session data
        this.body = this.session;
    })

    //Called when the app first loads and we want to know if we already have a session
    .post('/session', function *() {
        this.body = this.session;
    })

    .post('/logout', function *() {
        //If they're logged in, log them out
        if (this.session.logged_in) {
            this.session = null;
            this.status = 200;
        }

        //If they're not logged in, wtf r u doing
        else {
            this.status = 400;
            this.body = "Not logged in!";
        }
    })

    .post('/register', function *() {

        var form = this.request.body;

        //Validate parameters
        this.checkBody('username').notEmpty().len(5, 20, "Username must be between 5 and 20 characters.");
        this.checkBody('email').notEmpty().isEmail("Invalid email entered.");
        this.checkBody('password').notEmpty().len(3, 20, "Password must be between 3 and 20 characters.");
        this.checkBody('confirmPassword').eq(form.password, "Both the password fields must be the same.");

        //If one of the parameters is invalid, throw an error
        if (this.errors) {
            this.status = 400;
            this.body = this.errors;
            return;
        }

        //Encrypt the password
        var pw = yield bcrypt.hash(form.password, 10);

        //Try to insert the new row
        try {
            yield this
                .knex('user')
                .insert({
                    username: form.username,
                    email: form.email,
                    password: pw
                });
        }

            //If there's an error (e.g. an existing username or email) throw an error
        catch (e) {
            this.status = 400;
            this.body = e.message;
            return;
        }

        //Otherwise the registration succeeded
        this.body = "Success!";
    })

    .post('/stats', function *() {
        //If they're logged in, log them out
        if (this.session.logged_in) {
            var finds = yield this.knex('find')
                .where({"find.user_id": this.session.user_id})
                .join('photo', 'photo.photo_id', '=', 'find.photo_id');

            finds.forEach(function (row) {
                row.image_path = photoUrl.fullUrl(row.image_path)
            });

			var photos = yield this.knex('photo')
                .select('image_path', 'num_finds')
                .count('like.value as likes')
                .count('dislike.value as dislikes')
                .where('photo.user_id', '=', this.session.user_id)
                .leftJoin('like', function(){
                    this.on('photo.photo_id', '=', 'like.photo_id')
                        .on('like.value', '>', 1)
                })
                .leftJoin('like AS dislike', function(){
                    this.on('photo.photo_id', '=', 'like.photo_id')
                        .on('like.value', '<', 1)
                })
                .groupBy('photo.photo_id');

            photos.forEach(function (row) {
                row.image_path = photoUrl.fullUrl(row.image_path)
            });

            this.body = {
                photos: photos,
                finds: finds
            };
            this.status = 200;
        }

        //If they're not logged in, wtf r u doing
        else {
            this.status = 400;
            this.body = "Not logged in!";
        }
    });

module.exports = router.routes();