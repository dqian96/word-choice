//server controller for index page
var path = require('path');
exports.render = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../views/terms.html'));
};



