//file that describes routes or definition of URIs (request url and response) for the index pg
module.exports = function(app) {
    var profile = require('../controllers/server/profile.server.controller');
    app.get('/profile', profile.render);
    app.get('/profile.client.controller.js', profile.getClientController);

    var signin = require('../controllers/server/signin.server.controller');
    app.get('/api/get_check_user_logged_in', signin.get_check_user_logged_in);
    app.post('/api/post_log_out', signin.post_log_out);
};


