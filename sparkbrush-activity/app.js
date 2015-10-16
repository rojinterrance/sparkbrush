'use strict';

var express = require('express');
var path = require('path');
var url = require('url');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var router  = express.Router();

var _ = require('lodash');
_.mixin(require("lodash-deep"));

var redis = require('./routes/redis');

var app = express();
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/redis',redis);

app.post('/tester', function(req, res) {

	console.log(req.body);

	var rKey = req.body.rKey || '';
	var rVal = req.body.rVal || '';	

	var output = "";
	output += "rKey is: " + rKey;
	output += "rVal is: " + rVal;

  res.send(200, output);
});

app.set('port', process.env.PORT || 8000);
app.listen(app.get('port'));
console.log('listening on port 8000');