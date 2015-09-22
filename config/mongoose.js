//file to load the mongoose module

var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db);

    //Models used
    require('../app/models/writing_analyzer.server.model');
    require('../app/models/signin.server.model');

    return db;
};
