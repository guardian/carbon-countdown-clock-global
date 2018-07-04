//Guardian-specific responsive iframe function

iframeMessenger.enableAutoResize();
var countInterval;
var countSinceOpened = 0;
function init(data,location) {

	var millisecondsinSecond = 1000,
	millisecondsinMinute = 60 * millisecondsinSecond,
	millisecondsinHour = 60 * millisecondsinMinute,
	millisecondsInDay = 24 * millisecondsinHour,
    millisecondsinYear = 365 * millisecondsInDay;

	var locations = {"aus":"Australia's","world":"the world's","us":"the United States'"};
	console.log(data,location);
	var emissions = data['sheets']['sheets'][location][0];

	d3.select('#selectedCountry').text(locations[location]);

	console.log(emissions);
	var dateFormat = d3.time.format('%Y-%m-%d');
	var budgetLeft = d3.select("#budgetLeft");
	var remainingText = d3.select("#remainingText");
	var usedTextContainer = d3.select("#usedTextContainer");
	var usedText = d3.select("#usedText");
	var budgetUsed = d3.select("#budgetUsed");
	var totalBudget = d3.select("#totalBudget");
	var countUp = d3.select("#countUp");
	var remainingBar = d3.select("#remainingBar");
	var numFormat = d3.format(",.0f");
	var percentFormat = d3.format(".1f");

	var untilYear = d3.select("#untilYear");
	var untilDay = d3.select("#untilDay");
	var untilHour = d3.select("#untilHour");
	var untilMinute = d3.select("#untilMinute");
	var untilSecond = d3.select("#untilSecond");

	d3.select("#remainingCarbonText").text(emissions.remainingText);
	d3.select("#usedCarbonText").text(emissions.usedText);
	d3.select("#countText").text(emissions.countText);
	d3.select("#yearText").text(emissions.yearText);
	// d3.select("#notesText").html(emissions.notes);
	// d3.select("#subTitle").text(emissions.subTitle);
	//get average of most recent 4 quarters	

	var initialBudget = +emissions.initialBudget;

	totalBudget.html(numFormat(initialBudget));

	var recentMean = +emissions.mostRecentAnnualEmissions
	var startingBudget = +emissions.mostRecentBudget;
	var countingBudget = startingBudget + 0;
	
	var startDate = moment(emissions.startDate,'YYYY-MM-DD');
	var countDate = moment(startDate).clone();

	var currentBudget = (initialBudget - startingBudget);

	var now = moment();
	var timeDiff = now.diff(startDate, 'seconds');

	budgetLeft.html(startingBudget);
	budgetUsed.html(currentBudget);

	console.log("recentMean",recentMean,"startingBudget",startingBudget);

	while (countingBudget > 0) {
		// console.log(countingBudget);
		// console.log(countDate);
		countingBudget = countingBudget - recentMean;
		countDate.add(1, 'years');
	}
	

	var timeUntil = countDate.diff(now);
	var years = Math.floor(timeUntil/millisecondsinYear),
	    days = Math.floor((timeUntil % millisecondsinYear)/millisecondsInDay),
	    hours = Math.floor((timeUntil % millisecondsInDay)/millisecondsinHour),
	    mins = Math.floor((timeUntil % millisecondsinHour)/millisecondsinMinute),
	    secs = Math.floor((timeUntil % 60000));

	console.log("years",years,"days",days,"hours",hours,"mins",mins,"secs",secs)    

	tonsPerSecond = recentMean/31536000;

	currentBudget = currentBudget + (tonsPerSecond*timeDiff);

	console.log("currentBudget",currentBudget);

	budgetLeft.html(numFormat(initialBudget - currentBudget));

	var budgetLeftPercent = ((initialBudget - currentBudget)/initialBudget*100);
	var offset = 0;

	remainingBar.style("width",100 - budgetLeftPercent + "%");
	remainingText.style("left",100 - budgetLeftPercent/2  - 2 + "%");

	usedTextContainer.style("left", ((budgetLeftPercent)/2) + budgetLeftPercent + "%");
	
	remainingText.text(percentFormat(budgetLeftPercent) + "%");
	usedText.text(percentFormat(100 - budgetLeftPercent) + "%");


	countInterval = setInterval(function() {

		budgetLeftPercent = ((initialBudget - currentBudget)/initialBudget*100);
		budgetRemainingPercent = 100 - budgetLeftPercent;

		currentBudget = currentBudget + tonsPerSecond/10;
		budgetUsed.html(numFormat(currentBudget))
		budgetLeft.html(numFormat(initialBudget - currentBudget));
		
		countSinceOpened = countSinceOpened + 0.1;
		countUp.html(numFormat(countSinceOpened * tonsPerSecond));

		remainingBar.style("width", 100 - budgetLeftPercent + "%");
		remainingText.style("left", (100 - budgetLeftPercent) + (budgetLeftPercent/2) - 2 + "%");

		usedTextContainer.style("left", (100 - budgetLeftPercent)/2 + "%");
		
		remainingText.text(percentFormat(budgetLeftPercent) + "%");
		usedText.text(percentFormat(100 - budgetLeftPercent) + "%");

		timeUntil = countDate.diff(moment());
		years = Math.floor(timeUntil/millisecondsinYear),
	    days = Math.floor((timeUntil % millisecondsinYear)/millisecondsInDay),
	    hours = Math.floor((timeUntil % millisecondsInDay)/millisecondsinHour),
	    mins = Math.floor((timeUntil % millisecondsinHour)/millisecondsinMinute),
	    secs = Math.floor((timeUntil % 60000));

		untilYear.text(years);
		untilDay.text(days);
		untilHour.text(hours);
		untilMinute.text(mins);
		untilSecond.text(Math.floor(secs/1000));

		if (budgetLeftPercent > 90) {
			usedTextContainer.style("left", ((100 - budgetLeftPercent - 2)/2) + budgetLeftPercent + "%");
			usedText.text(percentFormat(100 - budgetLeftPercent));
		}
		
	
	},100)


} // end init


function getParameter(paramName) {
  var searchString = window.location.search.substring(1),
	  i, val, params = searchString.split("&");

  for (i=0;i<params.length;i++) {
	val = params[i].split("=");
	if (val[0] == paramName) {
	  return val[1];
	}
  }
  return null;
} 

function setupButtons() {
		shareInteractive();
	    var expanded = false;
    	d3.select("#dropDown").on("click", function () {
    		if (!expanded) {
    			d3.select("#notesText")
    				.transition()
    				.style("max-height","300px");

    			d3.select("#dropDown")
    				.style("background-image","url('img/up-arrow.svg')")

    			if (embedVisible) {
    				d3.select(".embedOverlay")
						.style("display", "none")
				
				embedVisible = false;	
    			}	

    			expanded = true;	
    		}

    		else {
    			d3.select("#notesText")
    				.transition()
    				.style("max-height","0px");

    			d3.select("#dropDown")
    				.style("background-image","url('img/down-arrow.svg')")	

    			expanded = false;		
    		}
    	})

    	var embedVisible = false;

    	d3.select(".btn-embed").on("click", function () {
    		if (!embedVisible) {
    			d3.select(".embedOverlay")
    				.style("display", "block")

    			embedVisible = true;		
    		}

    		else {
    			console.log("hiding");
    			d3.select(".embedOverlay")
    				.style("display", "none")
    			embedVisible = false;			
    		}
    	})

    	d3.select("#closeEmbed").on("click", function () {

			console.log("hiding");
			d3.select(".embedOverlay")
				.style("display", "none")
			embedVisible = false;			
    		
    	})
}


d3.loadData()
    .json('sheets',"https://interactive.guim.co.uk/docsdata/1UgP3cYQKA88wOEtJbl9VXLR_TvM6FQ9Ptwv8wYY2pXk.json")
    .onload(function(data) {

    	var location = getParameter("location");
   
    	console.log(location,blogStatus);
    	
    	init(data,location);
    	setupButtons();


    	var blogStatus = getParameter("blog");
    	if (blogStatus == "false") {
    		d3.select("#outer-wrapper").style("background-color","#FFF");
    	} 

    	var titleStatus = getParameter("title");
    	if (titleStatus == "false") {
    		d3.select(".chartTitle").style("display","none");
    		d3.select(".titleRow").style("display","none");
    	} 


});
