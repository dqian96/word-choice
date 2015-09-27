//Client controller for the homepage
//Note: The ngResource module provides interaction support with RESTful services via the $resource service.
var app = angular.module('indexApp', ['ngResource']);
app.controller('indexController', ['$scope', '$resource', '$window', function ($scope, $resource, $window) {
	
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


}]);