//file that describes routes or definition of URIs (request url and response) for the index pg
module.exports = function(app) {
    var writing_analyzer = require('../controllers/server/writing_analyzer.server.controller');
    app.get('/writing_analyzer', writing_analyzer.render);
    app.get('/writing_analyzer.client.controller.js', writing_analyzer.getClientController);
    app.post('/api/postSubmitArticle', writing_analyzer.postSubmitArticle);

    
    var signin = require('../controllers/server/signin.server.controller');
    app.get('/api/get_check_user_logged_in', signin.get_check_user_logged_in);
    app.post('/api/post_log_out', signin.post_log_out);
};
