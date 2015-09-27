//The ngResource module provides interaction support with RESTful services via the $resource service.
var app = angular.module('profileApp', ['ngResource']);
app.controller('profileController', ['$scope', '$resource', '$window', function ($scope, $resource, $window) {
	
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
		$('#noArticlesAnalyzedBefore').hide();
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
				$scope.username = result.username;

  				var GetUserStatistics = $resource("/api/get_user_statistics");
  				var getUserStatistics = new GetUserStatistics();
    			getUserStatistics.$get(function (result) {
    				var numberOfArticles = result.articlesData.length;

    				if (numberOfArticles == 0) {
    					$('#noArticlesAnalyzedBefore').show();
    					return;
    				}
    				//array of objects
    				var arrayOfArticles = result.articlesData;
    				var mostFrequentlyUsedWords = [];
    				//for each article

    				for (var i = 0; i < numberOfArticles; i++) {
    					//for each word in each article
	    				for (var oneOfManySynonms in arrayOfArticles[i].articleData[0]) {
					        if ((arrayOfArticles[i].articleData[0]).hasOwnProperty(oneOfManySynonms)) {
					            var alreadyInArray = false;
					            //if  in array
					            console.log(oneOfManySynonms);
					            for (var j = 0; j < mostFrequentlyUsedWords.length; j++) {
					            	//found in array to record most used words
					            	if (mostFrequentlyUsedWords[j].word == oneOfManySynonms) {
					            		mostFrequentlyUsedWords[j].frequency += arrayOfArticles[i].articleData[0][oneOfManySynonms].frequency; 
					            		alreadyInArray = true;
					            		break;
					            	}
					            }
					            //if not in array yet
					            if (!alreadyInArray) {
					            	mostFrequentlyUsedWords.push({
						              word: oneOfManySynonms,
						              frequency:  arrayOfArticles[i].articleData[0][oneOfManySynonms].frequency
						            });
					            }
					        }
					      } 
    				}

    				mostFrequentlyUsedWords.sort(function(word1, word2){
			          return -1*(word1.frequency-word2.frequency);
			      	});

					var graphNumberOfWords = 15;
					if (mostFrequentlyUsedWords.length < 15) {
						graphNumberOfWords = mostFrequentlyUsedWords.length;
					}
					var labels = [];
					var labelsData = [];

					for (var count = 0; count < graphNumberOfWords; count++) {
						labels.push(mostFrequentlyUsedWords[count].word);
						labelsData.push(mostFrequentlyUsedWords[count].frequency);
					}

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
    				console.log(mostFrequentlyUsedWords);


    			});


			}
			else {
				$scope.left_side_navbar_links.shift();
				//redirect from profile page if not signed in
				$window.location.href = "/";
			}
		});
	};  

	$scope.signOut = function () {
		if ($scope.right_side_navbar_links[0].url != "/signin") {
			var signOut = new SignOut();
			signOut.$save(function (result) {
			//$window.location.href = "/";
			});
		}
	};
	//Navbar=================================================================







}]);