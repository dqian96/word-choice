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

  var SubmitArticle = $resource("/api/postSubmitArticle");

  $scope.submitArticle = function () {
  	$('#analyze_btn').prop('disabled', true);
  	$('#analyze_btn').text('Hang on...');
  
  	var submitArticle = new SubmitArticle();
  	submitArticle.article = $scope.article;
  	submitArticle.$save(function (result) {
      
      
	  	$('#analyze_btn').prop('disabled', false);
	  	$('#analyze_btn').text('Analyze!');
	  	console.log(result.articleDataToBeStored);

  	});

  };



}]);