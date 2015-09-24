//server controller for index page
var path = require('path');

//Requiring models
var StoreArticleData = require('mongoose').model('Articles');

exports.render = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../views/writing_analyzer.html'));
};

exports.getClientController = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/writing_analyzer.client.controller.js'));
};

exports.postSubmitArticle = function(req, res, next) {
	console.log(req.body);

    var articleSynonms = getFrequency(req.body.article);
    if (req.user) {
         var articleDataToBeStored = {
            //req.user.id?
            user: req.user.username,
            user_id: req.session.passport.user,
            article: req.body.article,
            articleData: articleSynonms
        };   
    }
    else {
         var articleDataToBeStored = {
            user: "Anonymous Monkey",
            user_id: "What is the meaning of life?",
            article: req.body.article,
            articleData: articleSynonms
        };   
    }

    //Storing in DB
    var storeArticleData = new StoreArticleData(articleDataToBeStored);
    storeArticleData.save(function(err) {
        if (err) {
            return next(err);
        }
        else {
            //res.json(user);
        }
    });
    res.send(articleDataToBeStored);




};

//Function to analyze writing
function getFrequency(submittedArticle) {
    //replace numbers
    var articleNoPunctuationRemoveNumbersLowerCase = (((submittedArticle.replace(/[^\w\s]|_/g, "")).replace(/\s+/g, " ")).toLowerCase()).replace(/[0-9]/g, "");;
    var articleToArray = articleNoPunctuationRemoveNumbersLowerCase.match(/\S+/g);
    var articleLength = articleToArray.length;
    //words with no synonms are ignored...

    var articleSynonms = {};
    var synonms = {};
    //it is important to note that javscript objects are implemented as hashtables
    //in the v8 javascript engine...which is used in node js
    //so lookup and inputting is constant time...

    //should be O(n)
    for (var i = 0; i < articleLength; i++) {
        if (articleToArray[i] in articleSynonms) {
            articleSynonms.articleToArray[i].frequency += 1;
            articleSynonms.articleToArray[i].percentFrequency = (1.0*articleSynonms.articleToArray[i].frequency/articleLength)*100;
        }
        else {
            var synonms = getSynonms(articleToArray[i]);
            //only add to object if synonms found
            if (synonms != null) {
                articleSynonms.articleToArray[i] = {
                    frequency: 1,
                    percentFrequency: (1.0/articleLength)*100,
                    synonms: synonms
                };
            }
        }
    }
    return articleSynonms;
}


function getSynonms(word) {
    //require node http module
    var http = require("http");
    //url to fetch data from
        url = "http://words.bighugelabs.com/api/2/b2f0f15df7b63424a4a3a8ec9402892e/"+word+"/json";
    //get is a wrapper for request
    //which sets the http method to GET (get data from some url)
    //my request
    var request = http.get(url, function (response) {
        // data is streamed in chunks from the server
        // must handle "data event"
        var buffer = "", 
            data;
        //streaming chunks of data
        response.on("data", function (chunk) {
            buffer += chunk;
        }); 
        response.on("end", function (err) {
            if (buffer != "") {
                 // finished transferring data
                //buffer contains raw data streamed
                //console.log(buffer);
                //data is js obj after we parse the raw data (buffer), which is in JSON
                data = JSON.parse(buffer);
                //console.log(data);

                if (data == undefined || data == null) {
                    return null;
                }
                else {
                    return data;
                }
            }     
        }); 
    }); 
};