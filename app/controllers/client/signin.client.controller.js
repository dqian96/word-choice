var app = angular.module('signinApp', ['ngResource']);
app.controller('signinController', ['$scope', '$resource', '$window', function ($scope, $resource, $window) {

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

      //something is wrong with this
      });
    }
  };
  //Navbar=================================================================

  var SignIn = $resource("/api/post_user_authentication");
  var SignUp = $resource("/api/post_create_user");

  $scope.sign_in = function () {
    var signIn = new SignIn();
    signIn.username = $scope.sign_in_username;
    signIn.password = $scope.sign_in_password;
    console.log(signIn);
    signIn.$save(function (result) {
      if (!result.success) {
        $.notify({
          message: result.msg
        },{
          type: 'danger'
        });
      }
      else {
        $.notify({
          message: result.msg
        },{
          type: 'success'
        });
        $window.location.href = "/profile";
      }
    });
  };

  $scope.sign_up = function () {

    var correct_form_entries = true;

    if (!/^[A-Za-z0-9_-]{3,16}$/.test($scope.sign_up_username)) {
      console.log($scope.sign_up_username);
      correct_form_entries = false;
      $.notify({
        // options
        message: "The username you entered is wrong. Usernames must be between 3-16 characters and can only contain letters, numbers, _, and -."
      },{
        // settings
        type: 'danger'
      });
    }
    if (!/^[A-Za-z0-9_-]{6,18}$/.test($scope.sign_up_password)) {
      console.log($scope.sign_up_password);
      correct_form_entries = false;
      $.notify({
        // options
        message: "The password you entered is wrong. Usernames must be between 6-18 characters and can only contain letters, numbers, _, and -."
      },{
        // settings
        type: 'danger'
      });
    }
    if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test($scope.sign_up_email)) {
      correct_form_entries = false;
      console.log($scope.sign_up_email);
      $.notify({
        // options
        message: "A vallid email address is required."
      },{
        // settings
        type: 'danger'
      });
    }
    if (correct_form_entries) {
      var signUp = new SignUp();
      signUp.username = $scope.sign_up_username;
      signUp.password = $scope.sign_up_password;
      signUp.email = $scope.sign_up_email;
      signUp.$save(function (result) {
        if (!result.success) {
          $.notify({
            // options
            message: result.msg
          },{
            // settings
            type: 'danger'
          });
        }
        else {
          $.notify({
            // options
            message: result.msg
          },{
            // settings
            type: 'success'
          });
          $window.location.href = "/profile";
        }
      });
    }
  };
}]);

