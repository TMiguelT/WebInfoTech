var router = require('koa-router')();
var bcrypt = require('bcrypt-as-promised');

router
    //These are two different ways of performing the same query
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
    });

module.exports = router.routes();