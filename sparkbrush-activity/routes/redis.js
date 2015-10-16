'use strict';

var redis = require('redis'),
	_ 		= require('lodash'),
    express = require('express'),
    bodyParser = require('body-parser'),
    router  = express.Router();

if(client) {
	console.log('client is already set...');
}

var client = redis.createClient(15371, 'pub-redis-15371.us-east-1-2.5.ec2.garantiadata.com', {no_ready_check: true});
client.auth('sparky45', function (err) {
    if (err) throw err;
});

client.on('connect', function() {
    console.log('Connected to Redis');
});


router.post('/set', function(req, res) {

	var redisResponse;
	var rKey = req.body.rKey || '';
	var rVal = req.body.rVal || '';	
	var expire = req.body.expire || 50200;	

	client.set(rKey,rVal.toString(), redis.print);
	
	if(expire > 0) {
		client.expire(rKey,expire);
	}

	client.get(rKey, function (err, reply) {
	    if (err) throw err;	    
	    if(reply !== null) {
	    	console.log(reply);
			res.status(200).send(reply);
	    }
	    else {
	    	res.status(200).send(redisResponse);
	    }
	    
	});

});

router.get('/get/:rKey', function(req, res) {

	var rKey = req.params.rKey || '';

	var redisResponse = "";

	if(rKey !== '') {

		client.get(rKey, function (err, reply) {
	    if (err) throw err;	    
	    if(reply !== null) {

	    	console.log(reply);
			res.status(200).send(reply);
	   	}
	   	else {
	    	res.status(200).send(redisResponse);
	   	}
		});

	}
	else {
		res.json(200, redisResponse);
	}

});

router.get('/ttl/:rKey', function(req, res) {

	var rKey = req.params.rKey || '';

	var redisResponse = "";

	if(rKey !== '') {

		client.ttl(rKey, function (err, reply) {
	    if (err) throw err;	    
	    if(reply !== null) {

	    	console.log('my ttl response is...');
	    	console.log(reply);
			res.status(200).send(reply.toString());
	   	}
	   	else {
	    	res.status(200).send(redisResponse);
	   	}
		});

	}
	else {
		res.json(200, redisResponse);
	}

});

router.get('/del/:rKey', function(req, res) {

	var rKey = req.params.rKey || '';

	var redisResponse = "";

	if(rKey !== '') {

		client.del(rKey, function (err, reply) {
	    if (err) throw err;	    
			res.status(200).send('');
		});

	}
	else {
		res.status(200).send('');
	}

});



router.post('/activities', function(req, res) {

	var redisResponse;
	var rHash = req.body.rHash || '';
	var rKey = req.body.rKey || '';
	var rVal = req.body.rVal || '';	
	var expire = req.body.expire || 0;	

	//rVal = new Buffer(rVal).toString('base64');

	client.hset(rHash,rKey,rVal, redis.print);
	
	if(expire > 0) {
		client.expire(rHash,expire);
	}

	client.hgetall(rHash, function (err, reply) {
	    if (err) throw err;	    
	    if(reply !== null) {
	    	console.log(reply);
	    	redisResponse = reply;	    
			res.json(200, redisResponse);	    	

	    }
	    else {
			res.json(200, redisResponse);	    	
	    }
	    
	});

});

router.get('/activities/:rHash', function(req, res) {

	var rHash = req.params.rHash || '';
	var rKey = req.params.rKey || '';

	var redisResponse = {};
	var myInfo = "blah";

	if(rHash !== '') {

		client.hgetall(rHash, function (err, reply) {
	    if (err) throw err;	    
	    if(reply !== null) {

	    	console.log(reply);
	    	redisResponse = [];

				_.each(reply, function(v, k) {

			    	if(rHash !== 'activity:all:key-tracker') {

						  try {
							  var vOut = new Buffer(v, 'base64').toString('utf8');
							  vOut = JSON.parse(vOut);
						  }
						  catch(e) {
							  var vOut = v;
							}

			    	}
			    	else {
						res.status(200).send(reply);
			    	}

				  redisResponse.push(vOut);
				})

			console.log(redisResponse);
			res.status(200).send(redisResponse);
	   	}
	   	else {
			res.json(200, redisResponse);   		
	   	}
		});

	}
	else {
		res.json(200, myInfo);
	}

});

router.get('/activity-delete/:rHash', function(req, res) {

	var rHash = req.params.rHash || '';
	var rKey = req.params.rKey || '';

	var redisResponse = {};

	if(rHash !== '') {

		client.del(rHash, function (err, reply) {
	    if (err) throw err;	    
			res.status(200).json(redisResponse);
		});

	}
	else {
	res.status(200).json(redisResponse);
	}

});


router.get('/', function(req, res) {
  res.send('redis endpoint');
});

module.exports = router;