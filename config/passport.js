var passport = require('passport'),
    mongoose = require('mongoose');

//when user authenticated, passport saves its _id property (part of mongodb doc) to session
//_id will be used to fetch user from db

module.exports = function() {
    var User = mongoose.model('User');

    //serialization is converting an object to a series of bytes
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

    //we required the local strategy  so once we load the passport config file
    //in server js, it loads the strategies config file
    require('./strategies/local.js')();
};