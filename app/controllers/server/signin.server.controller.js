//server controller for index page
var path = require('path');
var User = require('mongoose').model('User');
var crypto = require('crypto');

exports.render = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../views/signin.html'));
};

exports.getClientController = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/signin.client.controller.js'));
};


exports.post_user_authentication = function (req, res, next) {
	//findone document in Users databse where username = ...
	console.log(req.session);
	User.findOne({
		username: req.body.username
	},
    function(err, user) {
        if (err) {
            return next(err);
        }
        else {
        	if (user == null) {
        		var isSucessful = {
        			'isSucessful': false
        		};
        		res.send(isSucessful);
        	}
            else if (md5_hash(req.body.password) == user.password) {
            	if (!req.session.user) {
            		req.session.user = req.body.username;	
            	}
            	console.log(req.session);
        		var isSucessful = {
        			'isSucessful': true
        		};
        		res.send(isSucessful);
            }
        }
    });


	
};

exports.post_create_user = function (req, res, next) {
	console.log(req.body);
	console.log(req.session);
	var password = req.body.password;
	console.log(password);
	var password_hash = md5_hash(password);

	var userData = {
		username: req.body.username,
		password: password_hash,
		email: req.body.email
	};

	//Storing in DB
    var user = new User(userData);
    user.save();
    res.send(req.body);


};

function md5_hash (password) {
	var hash = crypto.createHash('md5').update(password).digest('hex');
	return hash;
}

