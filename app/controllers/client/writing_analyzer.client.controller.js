//The ngResource module provides interaction support with RESTful services via the $resource service.
var app = angular.module('writing_analyzerApp', ['ngResource']);
app.controller('writing_analyzerController', ['$scope', '$resource', function ($scope, $resource) {
  
  $scope.test = "test";

  var SubmitArticle = $resource("/api/postSubmitArticle");

  $scope.submitArticle = function () {
  	$('#analyze_btn').prop('disabled', true);
  	$('#analyze_btn').text('Hang on...');
  
  	var submitArticle = new SubmitArticle();
  	submitArticle.article = $scope.article;
  	submitArticle.$save(function (result) {
  	
	  	$('#analyze_btn').prop('disabled', false);
	  	$('#analyze_btn').text('Analyze!');
	  	console.log(result.analyzed_article);
  	});

  };



}]);