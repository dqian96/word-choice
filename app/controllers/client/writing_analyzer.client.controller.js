//The ngResource module provides interaction support with RESTful services via the $resource service.
var app = angular.module('writing_analyzerApp', ['ngResource']);
app.controller('writing_analyzerController', ['$scope', '$resource', function ($scope, $resource) {
  
  $scope.test = "test"

  var Writing_Analyzer_Server_Controller = $resource("/api/postSubmitArticle");

  $scope.submitArticle = function () {
  	$scope.test = $scope.article;

  	var writing_analyzer = new Writing_Analyzer_Server_Controller();
  	writing_analyzer.name = $scope.test;
  	console.log($scope.test);
  	writing_analyzer.$save();

  }





}]);