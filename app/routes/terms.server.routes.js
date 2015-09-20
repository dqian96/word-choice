//file that describes routes or definition of URIs (request url and response) for the index pg
module.exports = function(app) {
    var terms = require('../controllers/server/terms.server.controller');
    app.get('/terms', terms.render);
};
