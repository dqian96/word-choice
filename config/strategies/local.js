//connecting passport module and adding the User model so passport local understands
//authentication
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

//set passport to authenticate using the local strategy
module.exports = function() {
    passport.use(new LocalStrategy(function(username, password, done) {
        //find one in User model that matches the entered username 
        User.findOne(
            {username: username},
            function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'Unknown user'});
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {message: 'Invalid password'});
                }
                return done(null, user);
            }
        );
    }));
};