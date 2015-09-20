    //File to load the express module

//include the express module
var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser');
    
//module.exports is the export of this file express.js (what is shown externally)
//in this case, the module.exports or the export itself is a function that returns aspp
module.exports = function() {
    var app = express();

    //replacement
    //app.set('views', './app/views');
	//app.set('view engine', 'html');

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());


	//requiring the files that handles routes for the app
    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/signin.server.routes.js')(app);
    require('../app/routes/terms.server.routes.js')(app);
    require('../app/routes/writing_analyzer.server.routes.js')(app);

    //uses the following directory for static files (depndency injections that each html file may access)
    //middleware 
    app.use(express.static('./public'));
    return app;
};
