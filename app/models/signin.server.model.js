var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	//md5 encryption for pass
	crypto = require('crypto');

//Schema for document in User collection
var UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true
    },
    password: String,
   	email: String,
    provider: String,
    providerId: String
});

//presave middleware (software compoenent that runs before save)
//for creating a md5 hash of the password for security
UserSchema.pre('save',
    //before we save a document in the User schema to the db, run the following function
    function(next) {
        if (this.password) {
            //create a md5 hash of the password
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

//User collection/class based on UserSchema
//each document in this collection/class is an instance of the model/class
mongoose.model('User', UserSchema);