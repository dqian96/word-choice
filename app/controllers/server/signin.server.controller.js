//server controller for index page
var path = require('path'),
	User = require('mongoose').model('User'),
	crypto = require('crypto'),
	passport = require('passport');

exports.render = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../views/signin.html'));
};

exports.getClientController = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/signin.client.controller.js'));
};


exports.post_user_authentication = function (req, res, next) {
	console.log(req.session);

	if (!req.user) {
		passport.authenticate('local', function(err, user, info) {
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
	else {		        
	    var result = {
	    	status: 3,
	    	success: false,
			msg: "Sign out first!"
		};
		res.send(result);  
	}
};



//uses User model to create new user
//first creates user object from HTTP request bdy
//then tries to save to mongodb, and if error occurs, logs it otherwise
//we login usign passport's login function
exports.post_create_user = function (req, res, next) {
    //if not signed in
    console.log(req.session);
    //duplicate key error pssible here
    if (!req.user) {
    	//creating user model
    	//body contains username, pass, email, we set fields in constructor
        var user = new User(req.body);
        user.provider = 'local';

        //save user creation to db, and callback function run
        user.save(function(err) {
            if (err) {
            	console.log(err);
            	//duplicate key possibly will error ere
               	var result = {
               		status: 5,
               		success: false,
					msg: "Username has been taken, please try a new one"
				};
				res.send(result);  
            }
            //login
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
    else {
       	var result = {
       		status: 3,
			msg: "Sign out first!",
			success: false
		};
		res.send(result);  
    }
};

exports.get_check_user_logged_in = function(req, res, next) {
	if (req.user) {
		var username = req.user.username;
		var result = {
			username: username
		};
		res.send(result);
	}
	else {
		var result = {
			username: null
		};
		res.send(result);
	}
};
	
exports.post_log_out = function(req, res) {
	if (req.user) {
		//req.logout();
		//res.redirect('/');

	req.session.destroy(function (err) {
	    res.redirect('/'); //Inside a callback… bulletproof!
	 });

	}
};
