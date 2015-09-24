//file that describes routes or definition of URIs (request url and response) for the index pg
module.exports = function(app) {
    var index = require('../controllers/server/index.server.controller');
    app.get('/', index.render);
    app.get('/index.client.controller.js', index.getClientController);

    var signin = require('../controllers/server/signin.server.controller');
    app.get('/api/get_check_user_logged_in', signin.get_check_user_logged_in);
    app.post('/api/post_log_out', signin.post_log_out);
};


