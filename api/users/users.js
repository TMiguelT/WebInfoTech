var router = require('koa-router')();
var bcrypt = require('bcrypt-as-promised');
var photoUrl = require('./../photoUrl');
var _ = require('lodash');
var queries = require("./queries");

router

    //Endpoint for logging in. Takes an email and password field
    .post('/login', function *() {
        var form = this.request.body;
        var user;

        //Validate form parameters and return them to the client
        this.checkBody('email').notEmpty("Email cannot be empty");
        this.checkBody('password').notEmpty("Password cannot be empty");
        if (this.errors) {
            this.status = 400;
            this.body = _.chain(this.errors).map(function(error){
                return _.values(error);
            }).flatten().value();
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
            this.body = [e.message];
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
            this.body = ["Invalid password!"];
            return;
        }

        //If everything is ok, log them in
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

    //Logs a user out
    .post('/logout', function *() {
        //If they're logged in, log them out
        if (this.session.logged_in) {
            this.session = null;
            this.status = 200;
        }

        //If they're not logged in, something is wrong
        else {
            this.status = 400;
            this.body = "Not logged in!";
        }
    })

    //Endpoint for registering a user. Takes username, email, password and confirmPassword fields.
    .post('/register', function *() {

        var form = this.request.body;

        //Validate parameters
        this.checkBody('username').notEmpty("Username cannot be empty").len(5, 20, "Username must be between 5 and 20 characters.");
        this.checkBody('email').notEmpty("Email cannot be empty").isEmail("Invalid email entered.");
        this.checkBody('password').notEmpty("Password cannot be empty").len(3, 20, "Password must be between 3 and 20 characters.");
        this.checkBody('confirmPassword').eq(form.password, "Both the password fields must be the same.");

        //If one of the parameters is invalid, throw an error
        if (this.errors) {
            this.status = 400;
            this.body = _.chain(this.errors).map(function(error){
                return _.values(error);
            }).flatten().value();
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
            if (e.message.indexOf("user_username_key") != -1)
                this.body = ["This email address is already registered. Please choose a unique email address"];
            else
                this.body = [e.message];
            return;
        }

        //Otherwise the registration succeeded
        this.body = "Success!";
    })

    //Used by the user page to get basic stats (score, number of finds, username etc.)
    .post('/userData', function *() {

        //Get the user ID that the user is querying, which will be the user's own ID if not specified
        var userId = queries.userIdFromQuery(this);

        //If they're querying themselves, include private data
        if (this.session.logged_in && this.session.user_id == userId)
            this.body = yield queries.privateUserData(this.knex, userId);
        else
            this.body = yield queries.publicUserData(this.knex, userId);
    })

    //Gets all the photos posted by the given user. Has userId and page fields as inputs. Includes a page variable for use in paginating the photos (each page is 10 photos)
    .post('/photos', function *() {
        //Get the user ID that the user is querying
        var userId = queries.userIdFromQuery(this);

        //Send the query response
        this.body = yield queries.userPhotos(this.knex, this.request.body.page, userId);
        return;
    })

        //Gets all the photos found by the given user. Has userId and page fields as inputs. Includes a page variable for use in paginating the photos (each page is 10 photos)
    .post('/finds', function *() {
        //Get the user ID that the user is querying
        var userId = queries.userIdFromQuery(this);

        //Send the query response
        this.body = yield queries.userFinds(this.knex, this.request.body.page, userId);
        return;
    });

module.exports = router.routes();