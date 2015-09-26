//The ngResource module provides interaction support with RESTful services via the $resource service.
var app = angular.module('writing_analyzerApp', ['ngResource']);
app.controller('writing_analyzerController', ['$scope', '$resource', '$window', function ($scope, $resource, $window) {
  
  //Navbar=================================================================
  //array of objects
  $scope.left_side_navbar_links = [
    {name: "Profile",
     url: "/profile"},
    {name: "Analyze your article!",
     url: "/writing_analyzer"},
    {name: "About",
     url: "/#about_content"}
  ];

  $scope.right_side_navbar_links = [
    {name: "Sign in",
     url: "/signin"
    }
  ];

  var UserLoggedIn = $resource("/api/get_check_user_logged_in");
  var SignOut = $resource("/api/post_log_out");

  $scope.init = function () {
    $("#analysis_row").css("display", "none");
    var userLoggedIn = new UserLoggedIn();
    userLoggedIn.$get(function (result) {
      //logged in
      if (result.username != null) {
        $scope.right_side_navbar_links.shift();  
        $scope.right_side_navbar_links.push(
          {
            name: "Sign out, "+result.username,
            url: "/"
          }); 
      }
      else {
        $scope.left_side_navbar_links.shift();
      }
    });
  };  

  $scope.signOut = function () {
    if ($scope.right_side_navbar_links[0].url != "/signin") {
      var signOut = new SignOut();
      signOut.$save(function (result) {
        $window.location.href = "/";
      });
    }
  };
  //Navbar=================================================================

  var SubmitArticle = $resource("/api/generateArticleResults");




  $scope.submitArticle = function () {
  	$('#analyze_btn').prop('disabled', true);
  	$('#analyze_btn').text('Hang on...');
    $("#analysis_row").css("display", "none");


    var submittedArticle = $scope.article;
    var articleNoPunctuationRemoveNumbersLowerCase = (((submittedArticle.replace(/[^\w\s]|_/g, "")).replace(/\s+/g, " ")).toLowerCase()).replace(/[0-9]/g, "");;
    var articleToArray = articleNoPunctuationRemoveNumbersLowerCase.match(/\S+/g);
    if (articleToArray == null) {
      $('#analyze_btn').prop('disabled', false);
      $('#analyze_btn').text('Analyze!');
      return;
    }
    var articleLength = articleToArray.length;
    if (articleLength > 2500) {
      $('#analyze_btn').prop('disabled', false);
      $('#analyze_btn').text('Analyze!');
      alert('Too long...please be courteous!');
      return;
    }
    var articleSynonms = {};

  	var submitArticle = new SubmitArticle();
    submitArticle.article = $scope.article;
    submitArticle.articleArray = articleToArray;
    submitArticle.presentIndex = 0;
    submitArticle.articleLength = articleLength;
    submitArticle.articleSynonms = articleSynonms;

  	submitArticle.$save(function (result) {
      //articleDataToBeStored = result
      var finalAnalysis = "<br><br>";
      var articleResults = result.articleData;
      var arrayArticleResultsForClient = [];

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
      arrayArticleResultsForClient.sort(function(word1, word2){
          return -1*(word1.frequency-word2.frequency);
      });
      console.log(arrayArticleResultsForClient);

      var graphNumberOfWords = 10;
      if (arrayArticleResultsForClient.length < 10) {
         graphNumberOfWords = arrayArticleResultsForClient.length;
      }
      labels = [];
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
      var myBarChartUserUpdated = new Chart(ctx).Bar(data, options);
//empty submit and max lenth

      //linear time to find synonms and frequncies (server)
      //linear time on client?
      //ok to do tomorrow: we can use object.keys to iterate through object and 
      //reconstruct an array to sort...
      //https://coderwall.com/p/_kakfa/javascript-iterate-through-object-keys-and-values
      //so it becomes linear on server instead of quadratic
      //not array of objects...instead object with properties as objects

      //to do:
    
      //profile  page

      for (var i = 0; i < arrayArticleResultsForClient.length; i++) {
          finalAnalysis = finalAnalysis + "<strong>Word: </strong>" + arrayArticleResultsForClient[i].word + " <br>" +
          "<strong>Frequency: </strong>" + arrayArticleResultsForClient[i].frequency + "<br>" +
          "<strong>Percentage Frequency: </strong>" + arrayArticleResultsForClient[i].percentFrequency + " <br>" +
          "<strong>Synonms: </strong>" + arrayArticleResultsForClient[i].synonms + "<br><br>";
      }
	  	$('#analyze_btn').prop('disabled', false);
	  	$('#analyze_btn').text('Analyze again!');
      $("#analysis").html(finalAnalysis);


      //console.log(finalAnalysis);
  	});

  };



}]);