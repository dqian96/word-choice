//server controller for writing analyzer page
var path = require('path');

//require node http module
var http = require("http");

//Requiring article model
var StoreArticleData = require('mongoose').model('Articles');

//give html file
exports.render = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../../views/writing_analyzer.html'));
};

//give client controller
exports.getClientController = function(req, res) {
    res.sendFile(path.resolve(__dirname + '/../client/writing_analyzer.client.controller.js'));
};

//recursive function that finds synonms via http request for each
//word in the article,  each recursive call is to the next word
//returns only when all words are considered
exports.generateArticleResults = function (req, res, next) {
    //if looped through  entire article already
    if (req.body.presentIndex == req.body.articleLength) {
        //if signed in
        if (req.user) {
            //response contains articleData and user data
             var articleDataToBeStored = {
                user: req.user.username,
                user_id: req.user.id,
                article: req.body.article,
                articleData: req.body.articleSynonms
            };   
        }
        //not signed in
        else {
            //response does not contain userdata 
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
                //console.log(articleDataToBeStored);
                res.send(articleDataToBeStored);
            }
        });
    }
    //if not done looping through article
    else {
        //current word under consideratioon
        var word = req.body.articleArray[req.body.presentIndex];
        //english structure words to be ignored
        var wordsIgnored = ['a','about','above','after','after','again',
        'against','ago','ahead','all','almost','along','already','also','although','always',
        'am','among','an','and','any','are',"aren't", 'around','as','at','away', 'backward',
        'backwards','be','because','before','behind','below','beneath','beside',
        'between','both','but','by', 'can','cannot',"can't", 'cause','cos','could',
        "couldn't", 'despite','did', "didn't", 'do','does',"doesn't", "don't",'down',
        'during', 'each','either','even','ever','every','except', 'for', 'forward',
        'from','had', "hadn't", 'has', "hasn't" , 'have', "haven't",'he','her',
        'here','hers','herself','him','himself','his','how','however','i','if',
        'in','inside','inspite','instead','into','is',"isn't",'it','its','itself',
        'just','least','less','like','many','may',"mayn't", 'me','might',
        "mightn't",'mine','more','most','much','must',"mustn't",'my','myself',
        'near','need',"needn't",'needs','neither','never','no','none','nor',
        'not','now', 'of','off','often','on','once','only','onto','or','ought',
        "oughtn't",'our','ours','ourselves','out','outside','over','past','perhaps',
        'quite','rather','seldom','several','shall',"shan't",'she','should',
        "shouldn't",'since','so','some','sometimes','soon','than','that','the',
        'their','theirs','them','themselves','then','there','these',
        'they','this','those','though','through','thus','till','to','together',
        'too','towards','under','unless','until','up','upon','us','used','was',
        "wasn't",'we','well','were',"weren't",'what','when','where','whether',
        'which','while','who','whom','whose','why','will','with', "won't", 'would', 
        "wouldn't",'yet','you','your','yours','yourself','yourselves'
        ];
        //if it is a word to be ignored, move on to the next word
        if (wordsIgnored.indexOf(word) > -1) {
            req.body.presentIndex += 1;
            exports.generateArticleResults(req, res, next);       
        }
        //if word should not be ignored, and if the word is already recorded in result
        //increase frequency and move on to next word
        else if (word in req.body.articleSynonms) {
            req.body.articleSynonms[word].frequency += 1;
            req.body.articleSynonms[word].percentFrequency  = (1.0*req.body.articleSynonms[word].frequency/req.body.articleLength)*100;
            req.body.presentIndex += 1;
            exports.generateArticleResults(req, res, next);
        }
        //if word should not be ignored and a new entry should be added in the result
        else {
            //url to fetch data from
            var url = "http://words.bighugelabs.com/api/2/b2f0f15df7b63424a4a3a8ec9402892e/"+word+"/json";
            //get is a wrapper for request
            //which sets the http method to GET (get data from some url)
            var request = http.get(url, function (response) {
                // data is streamed in chunks from the server
                //buffer contains raw data
                var buffer = "", 
                    data;
                //streaming chunks of data
                response.on("data", function (chunk) {
                    buffer += chunk;
                }); 

                //finished streaming
                response.on("end", function (err) {
                    //if buffer is not empty
                    if (buffer != "") {
                        //data is js obj after we parse the raw data (buffer), which is in JSON
                        data = JSON.parse(buffer);
                        var synonms = "<br>";

                        //checking type of synonm output from bighugelabs and adding appropriate titles and content to response
                        if (data.noun) {
                            if (data.noun.syn) {
                                var nounSyn = data.noun.syn;
                                synonms = synonms + "<br><i>As a noun: </i>" + nounSyn.join(" ") + ". <br> ";
                            }
                        }
                        if (data.verb) {
                            if (data.verb.syn) {
                                var verbSyn = data.verb.syn;
                                synonms = synonms + "<br><i>As a verb: </i>" + verbSyn.join(" ") + ". <br> ";
                            }
                        }                        
                        if (data.adjective) {
                            if (data.adjective.sim) {
                                var adjSyn = data.adjective.sim;
                                synonms = synonms + "<br><i>As an adjective: </i>" + adjSyn.join(" ") + ". <br> ";

                            }
                            else if (data.adjective.syn) {
                                var adjSyn = data.adjective.syn;
                                synonms = synonms + "<br><i>As an adjective: </i>" + adjSyn.join(" ") + ". <br> ";

                            }
                        }
                        if (data.adverb) {
                            if (data.adverb.syn) {
                                var adverbSyn = data.adverb.syn;
                                synonms = synonms + "<br><i>As an adverb: </i>" + adverbSyn.join(" ") + ". <br> ";
                            }
                        }     

                        //console.log(data);
                        //if data is valid/not empty,we add the new word object to response
                        if (!(data == undefined || data == null)) {
                            req.body.articleSynonms[word] = {
                                word: word,
                                frequency: 1,
                                percentFrequency: (1.0/req.body.articleLength)*100,
                                synonms: synonms
                            };
                        }
                    }
                    req.body.presentIndex += 1;
                    exports.generateArticleResults(req, res, next);
                }); 
            });
        }
    }
};

