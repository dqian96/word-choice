$( document ).ready(function() {
    console.log( "ready!" );
    //generating intial graph
	var data = {
	    labels:  ["internet", "love", "cat", "cute", "animal", "awesome", "beautiful"],
	    datasets: [
	        {
	            label: "Most Frequently Used Words",
	            fillColor: "rgba(220,220,220,0.5)",
	            strokeColor: "rgba(220,220,220,0.8)",
	            highlightFill: "rgba(220,220,220,0.75)",
	            highlightStroke: "rgba(220,220,220,1)",
	            data: [12, 8, 7, 5, 4, 2, 1]
	        },
	    ]
	};
	var options = {
		scaleFontColor: "white",
		scaleLineColor: "white"
	};
    var ctx = document.getElementById("myBarChart").getContext("2d");
    var myBarChart = new Chart(ctx).Bar(data, options);
});

