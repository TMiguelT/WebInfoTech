# Installation

First you have to install git if you haven't already: http://git-scm.com/downloads. Then you'll have to install node: https://nodejs.org/. It has to be node 0.12 or above to work.

So to install the project, go into the folder you use for programming stuff and type `git clone https://github.com/TMiguelT/WebInfoTech`. That will download a local copy of the repository for you to work on. It will ask for your username and password, so you'll have to enter them each time you push or pull from the repo (although you can set up SSH so you don't have to enter a password if you want)

Git will then create a new folder with all the code in it, so cd into that, and then run the command "npm install". That installs all the node package that we're using as dependencies. There might be a few errors but you can probably ignore them.

But we also have to install the frontend dependencies. So for that you need a tool called bower, and then get it to download things like the Angular library. So run `npm install bower -g` and then 'bower install' to do that.

Also with web development you often 'compile' HTML/CSS/JS assets in order to minify (make their filesize smaller), transpile (convert one language to another), or concatinate (combine files) these files. So you also need to install the build tool (compiler) and run a compile. So in the console go `npm install gulp -g` and then `gulp build` to compile the assets.

Now everything should be ready, so now whenever you want to run the server, run `npm start` inside the project folder, and the server should start. Then go to localhost:3000 in a web browser to see the website (which at the moment is just Jake's home page)

Luckily you don't have to do any of these steps again, except for `gulp build`, the compile step, which you'll have to do whenever you change some static files (e.g. html, css, js) that are for the frontend. You can set node up to automatically compile whenever you change a file but I'll explain that later if people are interested.

# Pulling and pushing using git

Whenever you need to get the latest version of everyone's code, you need to run the command `git pull origin master` and it should automatically merge your changes with the latest version. If there's a merge conflict (i.e. you and someone else have both changed the same line of a file, there will be a merge conflict. You can then manually edit the conflicting file to make it how you want.

Whenever you pull the latest version, I recommend running `npm install` and `gulp install` to make sure all the dependencies are correct.

Whenever you finish working on one 'part' of the application - it can be a single file or feature or concept, you should commit it. So for that you type `git add -A` to add all changed files to the commit, and then `git commit -m "MY COMMIT MESSAGE"` to give describe what you've done in that commit. Then you can type `git push origin master` to add it to the repo. If you haven't pulled the latest version, git will force you to do so at this point.

# Making changes appear on the website

Whenever you make changes to the nodejs code (i.e. the server code that's in /app.js and in the /api folder), you just have to restart the server to see your changes. So if the server is running, stop is using Ctrl+C in the terminal and then start it again with `npm start`.

If you've made changes to some of the angular code, or the html, css, images etc. You'll need to run `gulp build` and you shouldn't have to restart the server to get it to show up. Since `gulp build` takes forever, you can also open another terminal and run `gulp watch` which will watch all changes you make to files and automatically build whenever you do. This is probably a better option.

# API calls

When you need to access the database, you'll need to create a new API endpoint. To do so, make a new file in /api and call it something relevant (e.g. leaderboard.js if this API is going to be used for the leaderboard).

Then in /app.js (not /app/app.js, that's for Angular), you need to add the endpoint to the server by adding a line like this:
```javascript
.use(mount("/api", require("./api/leaderboard")))
```
What this means, is load the new javascript file located in /api/leaderboard.js (the .js extention is assumed) into the URL "/api". The `require()` function is node's way of importing a file, like python's `import` or ruby's `require`.

At the top of your API file you'll need

```javascript
var router = require('koa-router')();
```

This imports the router module, which is a function, and then calls this function to make a new router object.
You can then add some URLs with the router's methods, like `get()` and `post()`:

```javascript
router.get('/some/url', function *() {
    //Get something
})
```

Note that the URLs that you define like this are **relative** to the '/api' URL. So if you define a route like this:

```javascript
router.post('/tags', function *() {
})
```

You will have to access it in Angular with the URL `/api/tags`.

Each API function has to set the 'body' of the HTTP response. The way to do this is by setting `this.body` to something. For example to send a basic string from this URL you'd write `this.body = "Hello World"`.
Realistically, you'll probably be making database queries and setting the response body to the rows returned from the database. You might also be accessing the filesystem (where the photos are stored). Read the next section for more info on how to make queries.

# Making database queries

I've installed a query builder called [knex](http://knexjs.org/#Builder). The knex object is accessible as `this.knex`, so you can make queries like this:

```javascript
yield this.knex('user')
  .join('photo', 'user.user_id', 'photo.user_id')
  .where({
      username: 'MyUserName',
      email:  'my@email'
  }).select('user.username', 'photo.description')
```

Which will generate this SQL:

```sql
SELECT user.username, photo.description
FROM user JOIN photo ON user.user_id = photo.user_id
WHERE username = 'MyUserName' AND email = 'my@email'
```

You can also make raw SQL queries using `knex.raw`, and you can use question marks to indicate parameters you're going to pass in, and then pass in these parameters as an array which is the second argument. Here's an example where the first function uses the query building, and the second users raw SQL. For the raw SQL query, the question mark will be replaced by the number 1:

```javascript
router
    //These are two different ways of performing the same query
    .get('/tags', function *() {
        this.body = yield this.knex('tag').where('tag_id', '>', 1);
    })
    .get('/tags_raw', function *() {
        this.body = (yield this.knex.raw('SELECT * FROM tag WHERE tag_id > ?', [1])).rows;
    });
```

Note that if you use raw SQL you have to remember to wrap the whole thing in brackets and add '.rows' at the end to make it work.

The `yield` keyword that I've been using before each database query is a new JavaScript feature that you can look into if you want to, but all you need to know is that it has to be before each call to the database. Its function here is to get data that is returned asynchronously without having to use a callback function, which makes the code a lot simpler than traditional JavaScript.

There's an example with and without the query builder in the repo here: https://github.com/TMiguelT/WebInfoTech/blob/master/api/users.js.

# Background
## Node

As some background, Node is a JavaScript interpreter just like python is a Python interpreter and ruby is a Ruby interpreter, so you can type "node" into a terminal and you'll get an interactive console for JavaScript where you can type in whatever you want and it will evaluate it (like python and ruby). But node also has a built in server that's amazing, and that's what we're using for the backend of the site.