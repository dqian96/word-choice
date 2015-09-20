//server controller for index page
var path = require('path');
exports.render = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../views/writing_analyzer.html'));
};

exports.getClientController = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/writing_analyzer.client.controller.js'));
};

exports.postSubmitArticle = function(req, res) {
	console.log(req.body);
}