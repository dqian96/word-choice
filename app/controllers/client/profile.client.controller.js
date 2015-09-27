//Client controller for the profile page
var app = angular.module('profileApp', ['ngResource']);
app.controller('profileController', ['$scope', '$resource', '$window', function ($scope, $resource, $window) {
	
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
		$('#noArticlesAnalyzedBefore').hide();
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
				$scope.username = result.username;

				//api calls for getting user statistics from db
  				var GetUserStatistics = $resource("/api/get_user_statistics");
  				var getUserStatistics = new GetUserStatistics();
    			getUserStatistics.$get(function (result) {
    				//result is an object with articlesData as a property
    				//articleData's value is an array of objects (one object for each user submitted article)
    				var numberOfArticles = result.articlesData.length;
    				if (numberOfArticles == 0) {
    					$('#noArticlesAnalyzedBefore').show();
    					return;
    				}
    				//array of article objcts
    				var arrayOfArticles = result.articlesData;
    				
    				//array of objects to store most frequently used words (one object for each word)
    				var mostFrequentlyUsedWords = [];

    				//for each article
    				for (var i = 0; i < numberOfArticles; i++) {
    					//for each word in each article
	    				for (var oneOfManySynonms in arrayOfArticles[i].articleData[0]) {
					        if ((arrayOfArticles[i].articleData[0]).hasOwnProperty(oneOfManySynonms)) {
					            var alreadyInArray = false;
					            //check if the word in the article is already recoreded in mostFrequentlyUsedWords
					            for (var j = 0; j < mostFrequentlyUsedWords.length; j++) {
					            	//entered in array already
					            	if (mostFrequentlyUsedWords[j].word == oneOfManySynonms) {
					            		mostFrequentlyUsedWords[j].frequency += arrayOfArticles[i].articleData[0][oneOfManySynonms].frequency; 
					            		alreadyInArray = true;
					            		break;
					            	}
					            }
					            //if not in mostfrequentlyusedwords yet, add it as an object
					            if (!alreadyInArray) {
					            	mostFrequentlyUsedWords.push({
						              word: oneOfManySynonms,
						              frequency:  arrayOfArticles[i].articleData[0][oneOfManySynonms].frequency
						            });
					            }
					        }
					      } 
    				}

    				//sort array in order of decreasing word frequency 
    				mostFrequentlyUsedWords.sort(function(word1, word2){
			          return -1*(word1.frequency-word2.frequency);
			      	});

    				//max number of words on graph
					var graphNumberOfWords = 15;
					if (mostFrequentlyUsedWords.length < 15) {
						graphNumberOfWords = mostFrequentlyUsedWords.length;
					}

					//word array
					var labels = [];
					//frequency array
					var labelsData = [];

					for (var count = 0; count < graphNumberOfWords; count++) {
						labels.push(mostFrequentlyUsedWords[count].word);
						labelsData.push(mostFrequentlyUsedWords[count].frequency);
					}

					//data for graph
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
					var ctx = document.getElementById("myBarChart").getContext("2d");
					var myBarChartUserUpdated = new Chart(ctx).Bar(data, options);
    				//console.log(mostFrequentlyUsedWords);
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