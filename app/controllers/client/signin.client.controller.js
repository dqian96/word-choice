//Client controller for log in page
var app = angular.module('signinApp', ['ngResource']);
app.controller('signinController', ['$scope', '$resource', '$window', function ($scope, $resource, $window) {

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

  //api calls for sign in and sign up
  var SignIn = $resource("/api/post_user_authentication");
  var SignUp = $resource("/api/post_create_user");

  //when user press sign in button, this function is run
  $scope.sign_in = function () {
    var signIn = new SignIn();
    signIn.username = $scope.sign_in_username;
    signIn.password = $scope.sign_in_password;
    //console.log(signIn);

    //submit username and password to api call for sign in
    signIn.$save(function (result) {
      //if successful go to profile page
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

  //function run if sign up button is pressed
  $scope.sign_up = function () {
    var correct_form_entries = true;
    //testing user input using regex
    if (!/^[A-Za-z0-9_-]{3,16}$/.test($scope.sign_up_username)) {
      //console.log($scope.sign_up_username);
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
      //console.log($scope.sign_up_password);
      correct_form_entries = false;
      $.notify({
        // options
        message: "The password you entered is wrong. Passwords must be between 6-18 characters and can only contain letters, numbers, _, and -."
      },{
        // settings
        type: 'danger'
      });
    }
    if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test($scope.sign_up_email)) {
      correct_form_entries = false;
      //console.log($scope.sign_up_email);
      $.notify({
        // options
        message: "A vallid email address is required."
      },{
        // settings
        type: 'danger'
      });
    }

    //if correct form entries, sign up api call 
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

