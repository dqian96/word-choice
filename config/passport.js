var passport = require('passport'),
    mongoose = require('mongoose');

//when user is authenticated, passport saves its _id property (part of mongodb doc) to session
//_id will be used to fetch user from db

module.exports = function() {
    var User = mongoose.model('User');
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne(
            {_id: id},
            //do not fetch password field
            '-password',
            function(err, user) {
                done(err, user);
            }
        );
    });

    //we required the local strategy  so once we load the config/passport  file
    //in server js, it loads the local strategy file
    require('./strategies/local.js')();
};