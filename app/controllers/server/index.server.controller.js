//server controller for index page
var path = require('path');
exports.render = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../views/index.html'));
};

exports.getClientController = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/index.client.controller.js'));
};


