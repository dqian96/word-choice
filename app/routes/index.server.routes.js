//file that describes routes or definitions of urls
module.exports = function(app) {
	//url defniitons (mapping urls to function)
    var index = require('../controllers/server/index.server.controller');
    app.get('/', index.render);
    app.get('/index.client.controller.js', index.getClientController);
    //requiring module to access its api
    var signin = require('../controllers/server/signin.server.controller');
    app.get('/api/get_check_user_logged_in', signin.get_check_user_logged_in);
    app.post('/api/post_log_out', signin.post_log_out);
};


