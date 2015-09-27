//server controller for index page
var path = require('path');
var Articles = require('mongoose').model('Articles');

exports.render = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../views/profile.html'));
};

exports.getClientController = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/profile.client.controller.js'));
};

exports.getUserStatistics = function(req, res, next) {
    Articles.find({
            user_id: req.user.id
        },
        function(err, result) {
            if (err) {
                return next(err);
            }
            else {
            	//result is an array
                var objResult = {
                	articlesData: result
                };
 				res.send(objResult);
            }
        }
    );


};

