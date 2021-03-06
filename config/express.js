//File to load the express module

//include the express module
var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    cookieParser = require('cookie-parser'),
    passport = require('passport');


//module.exports is the export of this file express.js (what is shown externally)
//in this case, the module.exports or the export itself is a function that returns apps
module.exports = function() {
    var app = express();

    //BODY-PARSER
    //Express doesn't come with a built in body parser, or a tool/parser to parse/understand
    //json files.
    //When files are sent from the client controller to server controller (rest api)
    //it is in the JSON format, body parser allows express to understand json
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    //module to parse cookies
    app.use(cookieParser());
    //session info
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'i_hope_you_like_this_i_put_alot_of_work_into_this'
    }));
    //use passport module for sessions
    app.use(passport.initialize());
    app.use(passport.session());
    
	//requiring the files that handles routes for the app
    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/signin.server.routes.js')(app);
    require('../app/routes/terms.server.routes.js')(app);
    require('../app/routes/writing_analyzer.server.routes.js')(app);
    require('../app/routes/profile.server.routes.js')(app);

    //uses the following directory for static files (depndency injections that each html file may access)
    //middleware 
    app.use(express.static('./public'));
    return app;
};
