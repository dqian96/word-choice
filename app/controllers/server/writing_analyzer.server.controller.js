//server controller for index page
var path = require('path');

//Requiring models
var StoreArticle = require('mongoose').model('Articles');

exports.render = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../views/writing_analyzer.html'));
};

exports.getClientController = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/writing_analyzer.client.controller.js'));
};

exports.postSubmitArticle = function(req, res, next) {
	console.log(req.body);

	var articleResponse = writing_analyzer(req.body);

	//Storing article in DB

	//Sending reseponse back to client
	res.send(articleResponse);

	//Storing in DB
    var storeArticle = new StoreArticle(articleResponse);
    storeArticle.save(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(user);
        }
    });
};

//Function to analyze writing
function writing_analyzer(submittedArticle) {
	var returnArticle  =  {
		'analyzed_article': submittedArticle.article + 'i am return'
	};
	return returnArticle;
}