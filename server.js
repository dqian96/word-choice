//ENTRY POINT of user (first response)

//requiring necessary modules, the return of the module is the object module.exports
var config = require('./config/config'),
    mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    favicon = require('serve-favicon');

    //mongoose.js and express.js modules expose module.exports, which is a function by itself that returns 
    //db and app obj 
    db = mongoose(),
    app = express();

//app listens to port for requests
app.listen(config.port, '0.0.0.0');

//module.exports is the export of this module/file, or what is shown
//in this case, the application is the output of this file

app.use(favicon(__dirname + '/public/assets/img/logo.ico'));

module.exports = app;
console.log('Server running at http://localhost:' + config.port);	

