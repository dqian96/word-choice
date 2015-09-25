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
    var articleLength = articleToArray.length;
    var articleSynonms = [];

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

      articleResults.sort(function(word1, word2){
          return -1*(word1.frequency-word2.frequency);
      });

      console.log(articleResults[0]);
      //linear time to find synonms and frequncies (server)
      //linear time on client?
      //ok to do tomorrow: we can use object.keys to iterate through object and 
      //reconstruct an array to sort...
      //https://coderwall.com/p/_kakfa/javascript-iterate-through-object-keys-and-values
      //so it becomes linear on server instead of quadratic
      //not array of objects...instead object with properties as objects

      //to do:
      //1.change impl of server controller so that its linear
      //profile  page
      //cut down on synonms
      //get 10$ deal
      //upload to server
      //graph
      //article entry cant be none
      for (var i = 0; i < articleResults.length; i++) {
          finalAnalysis = finalAnalysis + "Word: " + articleResults[i].word + " <br>" +
          "Frequency: " + articleResults[i].frequency + "<br>" +
          "Percentage Frequency: " + articleResults[i].percentFrequency + " <br>" +
          "Synonms: " + articleResults[i].synonms + "<br><br>";
      }
	  	$('#analyze_btn').prop('disabled', false);
	  	$('#analyze_btn').text('Analyze!');
      $("#analysis_row").css("display", "block");
      $("#analysis").html(finalAnalysis);
      console.log(finalAnalysis);
  	});

  };



}]);