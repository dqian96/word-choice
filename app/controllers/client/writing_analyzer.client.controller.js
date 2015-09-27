  //Client controller of writing analyzer
  var app = angular.module('writing_analyzerApp', ['ngResource']);
  app.controller('writing_analyzerController', ['$scope', '$resource', '$window', function ($scope, $resource, $window) {
    
    //Navbar=================================================================
    
    //array of objects for recording the name and respective url of links on the left hand side of nav bar
    $scope.left_side_navbar_links = [
      {name: "Profile",
       url: "/profile"},
      {name: "Analyze your article!",
       url: "/writing_analyzer"},
      {name: "About",
       url: "/#about_content"}
    ];

    //urls for right hand side of navbar
    $scope.right_side_navbar_links = [
      {name: "Sign in",
       url: "/signin"
      }
    ];

    //api call for checking if user is logged in
    var UserLoggedIn = $resource("/api/get_check_user_logged_in");
    //api call for signing users out
    var SignOut = $resource("/api/post_log_out");

    //function run at page load
    $scope.init = function () {
      $("#analysis_row").css("display", "none");
      var userLoggedIn = new UserLoggedIn();
      userLoggedIn.$get(function (result) {
        //if user logged in, we adjust links in header
        if (result.username != null) {
          $scope.right_side_navbar_links.shift();  
          $scope.right_side_navbar_links.push(
            {
              name: "Sign out, "+result.username,
              url: "/"
            }); 
        }
        //user not logged in
        else {
          $scope.left_side_navbar_links.shift();
        }
      });
    };  
    //user sign out call
    $scope.signOut = function () {
      if ($scope.right_side_navbar_links[0].url != "/signin") {
        var signOut = new SignOut();
        signOut.$save(function (result) {
        });
      }
    };
    //Navbar=================================================================

    //api call to process submitted article
    var SubmitArticle = $resource("/api/generateArticleResults");

    //on submit article button press, run this function
    $scope.submitArticle = function () {
    	$('#analyze_btn').prop('disabled', true);
    	$('#analyze_btn').text('Hang on...');
      $("#analysis_row").css("display", "none");

      //removing punctuation and numbers and exploding submitted article
      //into an array 
      var submittedArticle = $scope.article;
      var articleNoPunctuationRemoveNumbersLowerCase = (((submittedArticle.replace(/[^\w\s]|_/g, "")).replace(/\s+/g, " ")).toLowerCase()).replace(/[0-9]/g, "");;
      var articleToArray = articleNoPunctuationRemoveNumbersLowerCase.match(/\S+/g);
      //if blank article, do nothing
      if (articleToArray == null) {
        $('#analyze_btn').prop('disabled', false);
        $('#analyze_btn').text('Analyze!');
        return;
      }
      //if article is too long
      var articleLength = articleToArray.length;
      if (articleLength > 2500) {
        $('#analyze_btn').prop('disabled', false);
        $('#analyze_btn').text('Analyze!');
        alert('Too long...please be courteous!');
        return;
      }

      //record all the synonms of words in the article as an object of object
      var articleSynonms = {};

      //sending to server article array and relevant data
    	var submitArticle = new SubmitArticle();
      submitArticle.article = $scope.article;
      submitArticle.articleArray = articleToArray;
      submitArticle.presentIndex = 0;
      submitArticle.articleLength = articleLength;
      submitArticle.articleSynonms = articleSynonms;

    	submitArticle.$save(function (result) {
        //finalAnalysis is html to be outputted
        var finalAnalysis = "<br><br>";
        //articleResults contain object of objects (synonms)
        var articleResults = result.articleData;
        //array to sort by frequency
        var arrayArticleResultsForClient = [];

        //loop through each of the propeties/words of the object of word objects
        //store each word object as an object in an array of objects

        //NOTE:
        //linear time to find synonms and frequncies (server) as we loop through article
        //once, and checking if it's already recorded is constant because 
        //javascript objects are hashtables
        //linear time on client as we loop through articleResults once 

        for (var wordInArticleResults in articleResults ) {
          if (articleResults.hasOwnProperty(wordInArticleResults)) {
              arrayArticleResultsForClient.push({
                word: articleResults[wordInArticleResults].word,
                frequency: articleResults[wordInArticleResults].frequency,
                percentFrequency: articleResults[wordInArticleResults].percentFrequency,
                synonms: articleResults[wordInArticleResults].synonms
              });
          }
        } 
        //sort the array of word objects by frequency
        arrayArticleResultsForClient.sort(function(word1, word2){
            return -1*(word1.frequency-word2.frequency);
        });
        //console.log(arrayArticleResultsForClient);

        //maximum labels on graph
        var graphNumberOfWords = 7;
        if (arrayArticleResultsForClient.length < 7) {
           graphNumberOfWords = arrayArticleResultsForClient.length;
        }

        //word labels
        labels = [];
        //frequency data for each word
        labelsData = [];

        for (var count = 0; count < graphNumberOfWords; count++) {
          labels.push(arrayArticleResultsForClient[count].word);
          labelsData.push(arrayArticleResultsForClient[count].frequency);
        }
        $('#myBarChart').replaceWith('<canvas id="myBarChartUserUpdated" width="400" height="400"></canvas>');
        var data = {
            labels:  labels,
            datasets: [
                {
                    label: "Most Frequently Used Words",
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: labelsData
                },
            ]
        };
        var options = { 
          scaleFontColor: "white",
          scaleLineColor: "white"
        };
        var ctx = document.getElementById("myBarChartUserUpdated").getContext("2d");
        //generate graph
        var myBarChartUserUpdated = new Chart(ctx).Bar(data, options);

        //looping through array for words to generate html output
        for (var i = 0; i < arrayArticleResultsForClient.length; i++) {
            finalAnalysis = finalAnalysis + "<strong>Word: </strong>" + arrayArticleResultsForClient[i].word + " <br>" +
            "<strong>Frequency: </strong>" + arrayArticleResultsForClient[i].frequency + "<br>" +
            "<strong>Percentage Frequency: </strong>" + arrayArticleResultsForClient[i].percentFrequency + " <br>" +
            "<strong>Synonms: </strong>" + arrayArticleResultsForClient[i].synonms + "<br><br>";
        }

  	  	$("#analyze_btn").prop('disabled', false);
  	  	$('#analyze_btn').text('Analyze again!');
        $("#analysis").html(finalAnalysis);
        $("#analysis_row").css("display", "block"); 

        //console.log(finalAnalysis);
    	});
    };
  }]);