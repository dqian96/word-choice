//connecting passport module and adding the User model so passport local understands
//authentication
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

//exports of module
//register strategy using passport.use() method, which takes in 
//an instance of the LocalStrategy object (strategy for local auth). 
//the callback function uses the Mongoose model to find a user
//with the pass username + try to authenticate it 


module.exports = function() {
    passport.use(new LocalStrategy(function(username, password, done) {
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