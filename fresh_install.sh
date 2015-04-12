#!/bin/bash
sudo apt-get install g++
npm install bower gulp -g
npm install & bower install --allow-root
gulp build
npm start