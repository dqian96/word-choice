//server controller for index page
var path = require('path');
var http = require("http");
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

    var submittedArticle = req.body.article;
    var articleNoPunctuationRemoveNumbersLowerCase = (((submittedArticle.replace(/[^\w\s]|_/g, "")).replace(/\s+/g, " ")).toLowerCase()).replace(/[0-9]/g, "");;
    var articleToArray = articleNoPunctuationRemoveNumbersLowerCase.match(/\S+/g);
    var articleLength = articleToArray.length;
    var articleSynonms = {};
    var articleDataToBeStored = exports.generateArticleResults(req, res, next);

};


exports.generateArticleResults = function (req, res, next) {
    var newWord = true;
    if (req.body.presentIndex == req.body.articleLength) {
        if (req.user) {
             var articleDataToBeStored = {
                //req.user.id?
                user: req.user.username,
                user_id: req.user.id,
                article: req.body.article,
                articleData: req.body.articleSynonms
            };   
        }
        else {
             var articleDataToBeStored = {
                user: "Anonymous Monkey",
                user_id: "What is the meaning of life?",
                article: req.body.article,
                articleData: req.body.articleSynonms
            };   
        }
        //Storing in DB
        var storeArticleData = new StoreArticleData(articleDataToBeStored);
        storeArticleData.save(function(err) {
            if (err) {
                return next(err);
            }
            else {
                console.log(articleDataToBeStored);
                res.send(articleDataToBeStored);
            }
        });
    }
    else {
        for (var count = 0; count < req.body.articleSynonms.length; count++) {
            if (req.body.articleArray[req.body.presentIndex] == req.body.articleSynonms[count].word) {
                req.body.articleSynonms[count].frequency += 1;
                req.body.articleSynonms[count].percentFrequency  = (1.0*req.body.articleSynonms[count].frequency/req.body.articleLength)*100;
                req.body.presentIndex += 1;
                newWord = false;
                break;
            }  
        }
        if (!newWord) {
            exports.generateArticleResults(req, res, next);

        }
        else {
            var word = req.body.articleArray[req.body.presentIndex];
            //require node http module
            //url to fetch data from
            var url = "http://words.bighugelabs.com/api/2/b2f0f15df7b63424a4a3a8ec9402892e/"+word+"/json";
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

                        var synonms = "";
                        if (data.noun) {
                            var nounSyn = data.noun.syn;
                            synonms = synonms + "<br>As a noun: " + nounSyn.join(" ") + ". || ";
                        }
                        if (data.verb) {
                            var verbSyn = data.verb.syn;
                            synonms = synonms + "<br>As a verb: " + verbSyn.join(" ") + ". || ";

                        }                        
                        if (data.adjective) {
                            if (data.adjective.sim) {
                                var adjSyn = data.adjective.sim;
                                synonms = synonms + "<br>As an adjective: " + adjSyn.join(" ") + ". || ";

                            }
                            else if (data.adjective.syn) {
                                var adjSyn = data.adjective.syn;
                                synonms = synonms + "<br>As an adjective: " + adjSyn.join(" ") + ". || ";

                            }
                        }
                        if (data.adverb) {
                            if (data.adverb.syn) {
                                var adverbSyn = data.adverb.syn;
                                synonms = synonms + "<br>As an adverb: " + adverbSyn.join(" ") + ". || ";
                            }

                        }     

                        //console.log(data);
                        if (!(data == undefined || data == null)) {
                            req.body.articleSynonms.push({
                                word: word,
                                frequency: 1,
                                percentFrequency: (1.0/req.body.articleLength)*100,
                                synonms: synonms
                            });
                        }
                    }
                    req.body.presentIndex += 1;
                    exports.generateArticleResults(req, res, next);
                }); 
            });
        }
    }
};

