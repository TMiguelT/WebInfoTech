# How to run the application
## Requirements
* Node.js (https://nodejs.org/)
* Bower
* Gulp

## How to install
1. Install Node from (https://nodejs.org/download/)
2. Run `npm install bower gulp -g` to install Bower and Gulp
3. Run `npm install` and `bower install` to install all the local server-side packages, and client-side components for the project
4. Run `gulp build` to build and compile the assets
5. Run `npm start` to start the web server and the API's
6. Now you are ready to view the website application. Just go to localhost:80
(If localhost:80 does not work on your browser, then go to the `app.js` file in the main directory of the application
and change line 53 to `app.listen(3000)` then do step 5 again and point your browser to localhost:3000)
