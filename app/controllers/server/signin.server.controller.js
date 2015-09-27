//server controller for sign in page
var path = require('path'),
	//model for recording users
	User = require('mongoose').model('User'),
	//md5 hashing
	crypto = require('crypto'),
	//user auth
	passport = require('passport');

//give html file
exports.render = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../views/signin.html'));
};

//give client controller
exports.getClientController = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/signin.client.controller.js'));
};


//checking user authentications
exports.post_user_authentication = function (req, res, next) {
	//console.log(req.session);

	//if no user signed in
	if (!req.user) {
		//use passport to authenticate using the local strategy
		passport.authenticate('local', function(err, user, info) {
			//callback function after trying to authenticate
			if (err) {
				return next(err); 
			}
			//false authentication
			if (user === false) {
				var result = {
					status: 2,
					success: false,
					msg: "False Authentication"
				};
				res.send(result);  
			} 
			//correct authentication
			else {
			    req.login(user, function(err) {
			        if (err) {
			        	return next(err);
			        }
			        var result = {
			        	status: 1,
			        	success: true,
						msg: "Correct Authentication and Login'd"
					};
					res.send(result);  
			    });

			}
		})(req, res, next); 
	}
	//user already logged in
	else {		        
	    var result = {
	    	status: 3,
	    	success: false,
			msg: "Sign out first!"
		};
		res.send(result);  
	}
};

//creates new user entry based on the User model
//first creates user object from HTTP request body
//then tries to save to mongodb, and if error occurs, logs it otherwise
//login if successful
exports.post_create_user = function (req, res, next) {
    //console.log(req.session);
    //if not logged in
    if (!req.user) {
 		//creates new user object from req.body (flls in the key-value pairs that a document in the User collection requries/schema)
        var user = new User(req.body);
        user.provider = 'local';

        //save user creation to db
        user.save(function(err) {
            if (err) {
            	//duplicate username error
            	var result = {
               		status: 5,
               		success: false,
					msg: "Username has been taken, please try a new one"
				};
				res.send(result);  
            }
            //no error -> try to log in
            req.login(user, function(err) {
                if (err) {
                    return next(err);
                }
               	var result = {
               		status: 4,
               		success: true,
					msg: "Sucessfully created account and signed in!"
				};
				res.send(result);  
            });
        });
    }
    //already signed in
    else {
       	var result = {
       		status: 3,
			msg: "Sign out first!",
			success: false
		};
		res.send(result);  
    }
};

//check if user logged in
exports.get_check_user_logged_in = function(req, res, next) {
	if (req.user) {
		var username = req.user.username;
		var result = {
			username: username
		};
		//if logged in, sends username
		res.send(result);
	}
	//not logged in, username is null
	else {
		var result = {
			username: null
		};
		res.send(result);
	}
};

//useer log out	
exports.post_log_out = function(req, res) {
	if (req.user) {
		req.session.destroy(function (err) {
		    res.redirect('/');
		});
	}
};
