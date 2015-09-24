var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	//md5 encryption for pass
	crypto = require('crypto');

var UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true
    },
    password: String,
   	email: String,
   	//strategy used to register user
    provider: String,
    //the user identifier for the authentication strategy
    providerId: String
});


//presave middleware (software compoenent that runs before save)
//for creating a md5 hash of the password for security
UserSchema.pre('save',
    function(next) {
        if (this.password) {
            var md5 = crypto.createHash('md5');
            this.password = md5.update(this.password).digest('hex');
        }

        next();
    }
);

//Accepts a string password arugment, which then hashes and compares
//to user's hashed pass
UserSchema.methods.authenticate = function(password) {
    var md5 = crypto.createHash('md5');
    md5 = md5.update(password).digest('hex');
    return this.password === md5;
};


//findUniqueUsername() static method,
//to find an anavlaible user name for 
//new users
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne(
        {username: possibleUsername},
        function(err, user) {
            if (!err) {
                if (!user) {
                    callback(possibleUsername);
                }
                else {
                    return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
                }
            }
            else {
                callback(null);
            }
        }
    );
};

mongoose.model('User', UserSchema);