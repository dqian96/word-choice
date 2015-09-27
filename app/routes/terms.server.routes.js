//file that describes routes or definitions of urls
module.exports = function(app) {
    var terms = require('../controllers/server/terms.server.controller');
    app.get('/terms', terms.render);
};
