//server controller for profile page
var path = require('path');

//requiring the Articles model for storing and retriving submitted Articles
var Articles = require('mongoose').model('Articles');

//give html file
exports.render = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../views/profile.html'));
};

//give client controller
exports.getClientController = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/profile.client.controller.js'));
};


//getting user stats from server
exports.getUserStatistics = function(req, res, next) {
    //find all articles with correct user id
    Articles.find({
            user_id: req.user.id
        },
        function(err, result) {
            if (err) {
                return next(err);
            }
            else {
            	//the response is an object which contains articlesData
                //which is an array of document objects that represent each article
                var objResult = {
                	articlesData: result
                };
 				res.send(objResult);
            }
        }
    );


};

