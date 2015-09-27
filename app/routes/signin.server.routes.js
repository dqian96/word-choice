//file that describes routes or definitions of urls
module.exports = function(app) {
    var signin = require('../controllers/server/signin.server.controller');
    app.get('/signin', signin.render);
    app.get('/signin.client.controller.js', signin.getClientController);
    app.post('/api/post_user_authentication', signin.post_user_authentication);
    app.post('/api/post_create_user', signin.post_create_user);
    app.get('/api/get_check_user_logged_in', signin.get_check_user_logged_in);
    app.post('/api/post_log_out', signin.post_log_out);
};


