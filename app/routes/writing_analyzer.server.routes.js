//file that describes routes or definitions of urls
module.exports = function(app) {
    var writing_analyzer = require('../controllers/server/writing_analyzer.server.controller');
    app.get('/writing_analyzer', writing_analyzer.render);
    app.get('/writing_analyzer.client.controller.js', writing_analyzer.getClientController);
    app.post('/api/generateArticleResults', writing_analyzer.generateArticleResults);

    
    var signin = require('../controllers/server/signin.server.controller');
    app.get('/api/get_check_user_logged_in', signin.get_check_user_logged_in);
    app.post('/api/post_log_out', signin.post_log_out);
};
