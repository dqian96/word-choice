//file that describes routes or definition of URIs (request url and response) for the index pg
module.exports = function(app) {
    var index = require('../controllers/server/index.server.controller');
    app.get('/', index.render);
    app.get('/index.client.controller.js', index.getClientController);
};
