//server controller for index page
var path = require('path');
exports.render = function(req, res) {
	//give html file
    res.sendFile(path.resolve(__dirname + '/../../views/index.html'));
};

exports.getClientController = function(req, res) {
	//give client controller
    res.sendFile(path.resolve(__dirname + '/../client/index.client.controller.js'));
};


