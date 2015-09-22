var app = angular.module('signinApp', ['ngResource']);
app.controller('signinController', ['$scope', '$resource', '$window', function ($scope, $resource, $window) {

  var SignIn = $resource("/api/post_user_authentication");
  var SignUp = $resource("/api/post_create_user");

  $scope.sign_in = function () {
    var signIn = new SignIn();
    signIn.username = $scope.sign_in_username;
    signIn.password = $scope.sign_in_password;

    signIn.$save(function (result) {
      console.log("sign in");
      if (result.isSucessful == true) {
        //$window.location.href = '/';
      }
      else {

      }
    });

  };

  $scope.sign_up = function () {
    var signUp = new SignUp();
    signUp.username = $scope.sign_up_username;
    signUp.password = $scope.sign_up_password;
    signUp.email = $scope.sign_up_email;

    signUp.$save(function (result) {
      console.log("sign up");
    });

  };

}]);

