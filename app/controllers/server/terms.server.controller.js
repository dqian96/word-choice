//server controller for terms page
var path = require('path');

//gives html file
exports.render = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../views/terms.html'));
};



